#!/bin/bash
# netmon.sh - read-only Wi-Fi / internet stability monitor for macOS.
#
# Uses only tools built into macOS (ping, dig, curl, traceroute, ifconfig, ipconfig,
# networksetup, scutil, route, system_profiler, osascript, log). It CHANGES NO SETTINGS:
# no DNS, Wi-Fi, router, firewall, VPN or proxy changes are made.
#
#   ./netmon.sh                          snapshot + 45 min monitor + report
#   ./netmon.sh -d 60                    monitor for 60 minutes
#   ./netmon.sh --snapshot               Phase 1 snapshot only (about 10 s)
#   ./netmon.sh --analyze DIR            rebuild the report from an earlier run
#   ./netmon.sh --compare BEFORE AFTER   Phase 4: compare two runs
# Options:
#   -o BASE        where runs are saved (default ~/netmon)
#   --speedtest    also run Apple's networkQuality at start and end (uses ~1 GB of data)
# Tip: "sudo ./netmon.sh" adds the Wi-Fi access point ID (BSSID) via wdutil, which shows roaming.
# Ctrl+C stops early and still writes the report.

set -u
export LC_ALL=C
PATH=/usr/bin:/bin:/usr/sbin:/sbin:$PATH

DURATION=45
BASE="$HOME/netmon"
MODE=run
SPEEDTEST=0
A_DIR=""; B_DIR=""

while [ $# -gt 0 ]; do
  case $1 in
    -d) DURATION=$2; shift 2;;
    -o) BASE=$2; shift 2;;
    --snapshot) MODE=snapshot; shift;;
    --analyze) MODE=analyze; A_DIR=$2; shift 2;;
    --compare) MODE=compare; A_DIR=$2; B_DIR=$3; shift 3;;
    --speedtest) SPEEDTEST=1; shift;;
    -h|--help) sed -n '2,22p' "$0"; exit 0;;
    *) echo "Unknown option: $1" >&2; exit 1;;
  esac
done

# ------------------------------------------------------------------ analysis (awk)
read -r -d '' ANALYZE_AWK <<'AWK_EOF'
function base(f,  n, a) { n = split(f, a, "/"); return a[n] }
function pct(t, p,  total, need, c, b) {
  total = okc[t]; if (total == 0) return "-"
  need = p * total; c = 0
  for (b = 0; b <= 20000; b++) { c += H[t, b]; if (c >= need) return b / 2 }
  return mx[t]
}
function r1(x) { return (x == "-" || x == "") ? "-" : sprintf("%.1f", x) }
function lossp(t) { return n[t] ? sprintf("%.1f", 100 * (lost[t] + err[t]) / n[t]) : "-" }
function isbad(t, ts) { return (P[t, ts] == "loss" || P[t, ts] == "err") }
function isslow(t, ts) { return (P[t, ts] == "ok" && R[t, ts] > thr[t]) }
function band(b) { return (b == "-" || b == "") ? "?" : b " GHz" }
BEGIN {
  GWSPIKE = 100; HOPSPIKE = 250; INETMIN = 200; INETMULT = 3
  DNSSLOW = 1000; RSSI_WEAK = -70; SNR_LOW = 20; GAP = 5
  label["gw"] = "Router (your Wi-Fi router)"; label["modem"] = "Modem / 2nd router"
  label["isp"] = "ISP first hop"; label["inet1"] = "Internet 1.1.1.1"; label["inet2"] = "Internet 8.8.8.8"
}
{ f = base(FILENAME) }
f == "meta.env" { i = index($0, "="); if (i) M[substr($0, 1, i - 1)] = substr($0, i + 1); next }
f ~ /^ping_/ {
  t = substr(f, 6); sub(/\.log$/, "", t); ts = $1 + 0
  HMS[ts] = $2; seen[ts] = 1
  if (!(t in TG)) { TG[t] = 1 }
  P[t, ts] = $3; n[t]++
  if ($3 == "ok") { r = $4 + 0; R[t, ts] = r; okc[t]++; b = int(r * 2); if (b > 20000) b = 20000; H[t, b]++; if (r > mx[t]) mx[t] = r }
  else if ($3 == "err") err[t]++
  else lost[t]++
  if (T0 == "" || ts < T0) T0 = ts
  if (ts > T1) T1 = ts
  next
}
f == "wifi.log" {
  nw++; W_ts[nw] = $1 + 0; W_r[nw] = $3; W_n[nw] = $4; W_tx[nw] = $5; W_ch[nw] = $6; W_b[nw] = $7; W_w[nw] = $8; W_bs[nw] = $9
  HMS[$1 + 0] = $2; next
}
f == "dns.log" {
  ts = $1 + 0; HMS[ts] = $2; lb = $3; dn[lb]++
  if ($4 != "ok") { df[lb]++; dfk[lb, $4]++; if (lb ~ /^sys/) { for (q = 0; q < 10; q++) DB[ts + q] = 1; MDF[int(ts / 60)]++ } }
  else { ds[lb] += $5; dok[lb]++; if ($5 + 0 > DNSSLOW) dslow[lb]++ }
  next
}
f == "link.log" {
  nl++; L_ts[nl] = $1 + 0; HMS[$1 + 0] = $2
  bad = ($3 != "active" || $4 == "-" || $5 == "-")
  L_bad[nl] = bad
  if (bad && !prevbad) { drops++; DROPAT[drops] = $2 }
  prevbad = bad
  if ($4 != "-") { if (lastip != "" && $4 != lastip) ipchg++; lastip = $4 }
  next
}
f == "http.log" {
  nh++
  if ($3 != "200") { hf++; HFAT[hf] = $2 } else if ($6 + 0 > 3) hslow++
  next
}
f == "wifi_profile_start.txt" {
  if ($0 ~ /Other Local Wi-Fi Networks:/) other = 1
  if (other && $1 == "Channel:") { cur = $2 + 0; nb[cur]++; nbtotal++ }
  if (other && $0 ~ /Signal \/ Noise:/) { s = $0; sub(/.*Noise: */, "", s); s += 0; if (cur != "" && (nbs[cur] == "" || s > nbs[cur])) nbs[cur] = s }
  next
}
f == "speed_start.txt" || f == "speed_end.txt" {
  if ($0 ~ /capacity|Responsiveness|Idle Latency/) SPD[f] = SPD[f] "    " $0 "\n"
  next
}
END {
  if (T0 == "") { print "# Network report\n\nNo ping data found in this folder."; exit }
  dur = (T1 - T0) / 60

  # thresholds
  thr["gw"] = GWSPIKE; thr["modem"] = GWSPIKE * 1.5
  for (t in TG) { med[t] = pct(t, 0.5); p95[t] = pct(t, 0.95) }
  thr["isp"] = (med["isp"] != "-" && med["isp"] * 4 > HOPSPIKE) ? med["isp"] * 4 : HOPSPIKE
  for (k = 1; k <= 2; k++) { t = "inet" k; thr[t] = (med[t] != "-" && med[t] * INETMULT > INETMIN) ? med[t] * INETMULT : INETMIN }

  # wifi summary
  for (k = 1; k <= nw; k++) {
    rs = W_r[k] + 0
    if (W_r[k] == "-" || rs == 0) { wna++; continue }
    wv++; rsum += rs; if (wmin == "" || rs < wmin) wmin = rs; if (wmax == "" || rs > wmax) wmax = rs
    RH[-rs]++
    if (rs < RSSI_WEAK) wweak++
    if (W_n[k] != "-" && W_n[k] + 0 < 0) { snr = rs - W_n[k]; snrv++; SH[snr < 0 ? 0 : snr]++; if (snr < SNR_LOW) snrlow++ }
    if (W_tx[k] != "-") { tx = W_tx[k] + 0; txv++; TXH[int(tx)]++; if (txmin == "" || tx < txmin) txmin = tx }
    chs = W_ch[k] "@" W_b[k]; if (!(chs in CHSEEN)) { CHSEEN[chs] = 1; chlist = chlist (chlist == "" ? "" : ", ") "ch " W_ch[k] " (" band(W_b[k]) ", " W_w[k] " MHz)" }
    if (lastch != "" && W_ch[k] != lastch) chchg++
    lastch = W_ch[k]
    if (W_bs[k] != "-" && W_bs[k] != "") { if (lastbs != "" && W_bs[k] != lastbs) { roams++; ROAMAT[roams] = HMS[W_ts[k]] } lastbs = W_bs[k] }
    curch = W_ch[k] + 0; curband = W_b[k]
  }
  if (wv) { c = 0; for (x = 0; x <= 120; x++) { c += RH[x]; if (c >= wv / 2) { rmed = -x; break } } }
  if (snrv) { c = 0; for (x = 0; x <= 120; x++) { c += SH[x]; if (c >= snrv / 2) { smed = x; break } } }
  if (txv) { c = 0; for (x = 0; x <= 10000; x++) { c += TXH[x]; if (c >= txv / 2) { txmed = x; break } } }

  # per-second scan -> incidents + per-minute timeline
  ninc = 0; lastbad = -1000; badsec = 0; secs = 0; pauses = 0; prevseen = 0
  for (ts = T0; ts <= T1; ts++) {
    if (!seen[ts]) continue
    if (prevseen && ts - prevseen > 15) { pauses++; PAUSEAT[pauses] = HMS[prevseen] "-" HMS[ts] }
    prevseen = ts; secs++
    mm = int(ts / 60); if (!(mm in ML)) { ML[mm] = substr(HMS[ts], 1, 5) }
    gl = isbad("gw", ts); gs = isslow("gw", ts); ge = (P["gw", ts] == "err")
    i1 = ("inet1", ts) in P; i2 = ("inet2", ts) in P
    il = (i1 && i2) ? (isbad("inet1", ts) && isbad("inet2", ts)) : (i1 ? isbad("inet1", ts) : isbad("inet2", ts))
    is = 0
    if (!il && i1 && i2) is = ((isslow("inet1", ts) || isbad("inet1", ts)) && (isslow("inet2", ts) || isbad("inet2", ts)))
    if (i1 && i2 && !il && (isbad("inet1", ts) != isbad("inet2", ts))) single++
    if (gl) { MGL[mm]++ }
    if (P["gw", ts] == "ok" && R["gw", ts] > MGM[mm]) MGM[mm] = R["gw", ts]
    if (il) MIL[mm]++
    if (i1 && P["inet1", ts] == "ok" && R["inet1", ts] > MIM[mm]) MIM[mm] = R["inet1", ts]
    if (gs) MGS[mm]++
    if (is) MIS[mm]++
    bad = gl || gs || il || is || DB[ts]
    if (!bad) continue
    MB[mm]++
    if (ts - lastbad > GAP) { ninc++; IS[ninc] = ts }
    IE[ninc] = ts; lastbad = ts; Ib[ninc]++
    if (gl) Igl[ninc]++
    if (ge) Ige[ninc]++
    if (gs) Igs[ninc]++
    if (il) Iil[ninc]++
    if (is) Iis[ninc]++
    if (DB[ts]) Idf[ninc]++
    if (isbad("isp", ts)) Iisp[ninc]++
    if (isbad("modem", ts)) Imod[ninc]++
  }
  # wifi minute minimum RSSI
  for (k = 1; k <= nw; k++) { mm = int(W_ts[k] / 60); rs = W_r[k] + 0; if (W_r[k] != "-" && rs != 0 && (MR[mm] == "" || rs < MR[mm])) MR[mm] = rs }

  # classify incidents
  split("WIFI_DROP WIFI_WEAK ROAM WIFI_LOCAL MODEM ISP WAN_SLOW DNS", CATS, " ")
  CN["WIFI_DROP"] = "Wi-Fi disconnects (the Mac lost its connection to the router)"
  CN["WIFI_WEAK"] = "Weak Wi-Fi signal (router slow or unreachable while signal was weak)"
  CN["ROAM"] = "Switching between Wi-Fi access points / mesh nodes"
  CN["WIFI_LOCAL"] = "Wi-Fi interference or an overloaded router (router slow while signal was fine)"
  CN["MODEM"] = "Link between your router and the ISP modem"
  CN["ISP"] = "ISP / internet line (router fine, internet lost)"
  CN["WAN_SLOW"] = "Internet line congestion (router fine, internet latency spikes; busy line or ISP congestion)"
  CN["DNS"] = "DNS failures (connection fine, name lookups failed)"
  nblip = 0; nreal = 0
  CS2["WIFI_DROP"] = "Wi-Fi drop"; CS2["WIFI_WEAK"] = "Weak signal"; CS2["ROAM"] = "Roaming"; CS2["WIFI_LOCAL"] = "Wi-Fi/router"
  CS2["MODEM"] = "Router-modem"; CS2["ISP"] = "ISP/line"; CS2["WAN_SLOW"] = "Line congestion"; CS2["DNS"] = "DNS"
  for (k = 1; k <= ninc; k++) {
    s = IS[k]; e = IE[k]
    ld = 0; for (j = 1; j <= nl; j++) if (L_ts[j] >= s - 5 && L_ts[j] <= e + 5 && L_bad[j]) ld = 1
    rmin = ""; rm = 0; pb = ""; pc = ""
    for (j = 1; j <= nw; j++) if (W_ts[j] >= s - 15 && W_ts[j] <= e + 15) {
      rs = W_r[j] + 0; if (W_r[j] != "-" && rs != 0 && (rmin == "" || rs < rmin)) rmin = rs
      if (pb != "" && W_bs[j] != "-" && W_bs[j] != pb) rm = 1
      if (pc != "" && W_ch[j] != pc) rm = 1
      if (W_bs[j] != "-") pb = W_bs[j]; pc = W_ch[j]
    }
    IR[k] = rmin
    if (Ib[k] < 2 && !ld && !Idf[k]) { IC[k] = "blip"; nblip++; continue }
    nreal++; badsec += Ib[k]
    if (ld || Ige[k]) c = "WIFI_DROP"
    else if (Igl[k] + Igs[k] > 0) c = (rmin != "" && rmin < RSSI_WEAK) ? "WIFI_WEAK" : (rm ? "ROAM" : "WIFI_LOCAL")
    else if (Iil[k] + Iis[k] > 0) c = (Imod[k] > 0) ? "MODEM" : ((Iil[k] > 0) ? "ISP" : "WAN_SLOW")
    else c = "DNS"
    IC[k] = c; CC[c]++; CS[c] += Ib[k]
  }

  # ----- report
  printf "# Network stability report\n\n"
  printf "Run: %s, %s to %s (%.0f min). Mac: %s, Wi-Fi interface %s.\n\n", M["DATE"], HMS[T0], HMS[T1], dur, M["MACOS"], M["WIFI_DEV"]

  # ranking
  nr = 0; for (k = 1; k <= 8; k++) { c = CATS[k]; if (CC[c]) { nr++; RK[nr] = c } }
  for (a = 1; a <= nr; a++) for (b2 = a + 1; b2 <= nr; b2++) if (CS[RK[b2]] > CS[RK[a]]) { tmp = RK[a]; RK[a] = RK[b2]; RK[b2] = tmp }
  printf "## Verdict (plain language)\n\n"
  if (nr == 0) {
    if (nblip) printf "Only %d isolated single lost or slow pings (normal on any network). ", nblip
    printf "No problems were recorded during this run: the router, the internet and DNS all answered normally.\n"
    printf "The issue did not happen while monitoring. Run it again during the time of day when it usually happens.\n\n"
  } else {
    printf "%d problem period(s) were recorded, %d seconds in total (%.1f%% of the run), plus %d isolated single-ping blips (normal).\n", nreal, badsec, (secs ? 100 * badsec / secs : 0), nblip
    printf "Most likely cause, by the time it accounts for: **%s**.\n\n", CN[RK[1]]
    if (RK[1] ~ /^WIFI|ROAM/) printf "The problems start *inside your home*: the Mac could not reach its own router reliably. That is a Wi-Fi or router problem, not the ISP.\n\n"
    if (RK[1] ~ /^(ISP|WAN_SLOW|MODEM)$/) printf "The Mac reached the router normally while the internet was failing, so the Wi-Fi was fine. The problem is between your router and the internet (modem, line or ISP).\n\n"
    if (RK[1] == "DNS") printf "The connection stayed up, but name lookups failed, which makes websites and apps appear offline.\n\n"
  }

  printf "## Ranked causes (from the evidence)\n\n"
  if (nr == 0) printf "None: no evidence of a fault in this run.\n\n"
  else {
    printf "| Rank | Cause | Periods | Seconds | Evidence strength |\n|---|---|---|---|---|\n"
    for (a = 1; a <= nr; a++) { c = RK[a]; st = (CS[c] >= 60 || (CC[c] >= 3 && CS[c] >= 15)) ? "Strong" : ((CS[c] >= 10) ? "Moderate" : "Weak (short events)")
      printf "| %d | %s | %d | %d | %s |\n", a, CN[c], CC[c], CS[c], st }
    printf "\n"
  }

  printf "## Your setup\n\n"
  printf "- Wi-Fi network: %s, active interface: %s%s\n", M["SSID"], M["DEFAULT_IF"], (M["DEFAULT_IF"] ~ /^utun|^ipsec|^ppp/) ? " (VPN is carrying your traffic)" : ""
  printf "- Mac IP %s, router %s, DNS servers: %s%s\n", M["MY_IP"], M["GW"], M["DNS"], (M["DNS1"] == M["GW"]) ? " (the router answers DNS itself)" : ""
  printf "- Path to internet: router %s%s%s\n", M["GW"], (M["MODEM"] != "") ? " -> second router/modem " M["MODEM"] " (double NAT)" : "", (M["ISP"] != "") ? " -> ISP " M["ISP"] : " -> (ISP hop did not answer traceroute)"
  if (chlist != "") printf "- Wi-Fi channel(s) used: %s\n", chlist
  if (nbtotal) { printf "- Nearby networks seen: %d; on your channel %d: %d%s\n", nbtotal, curch, nb[curch] + 0, (nb[curch] > 0) ? " (strongest " nbs[curch] " dBm)" : "" }
  printf "\n"

  printf "## Latency and packet loss\n\n| Target | Pings | Lost | Loss %% | Median ms | 95th pct ms | Max ms | Spikes (> threshold) |\n|---|---|---|---|---|---|---|---|\n"
  split("gw modem isp inet1 inet2", ORD, " ")
  for (k = 1; k <= 5; k++) { t = ORD[k]; if (!(t in TG)) continue
    sp = 0; for (ts = T0; ts <= T1; ts++) if (isslow(t, ts)) sp++
    SPK[t] = sp
    printf "| %s (%s) | %d | %d | %s | %s | %s | %s | %d (> %.0f ms) |\n", label[t], M["T_" t], n[t], lost[t] + err[t], lossp(t), r1(med[t]), r1(p95[t]), r1(mx[t]), sp, thr[t] }
  printf "\nThe router is the most important row: loss or spikes there are a Wi-Fi/home-network problem. Loss only on the internet rows (with the router clean) points at the modem, line or ISP.\n"
  if ("isp" in TG) printf "ISP routers often give pings low priority, so loss on the ISP-hop row alone is only supporting evidence.\n"
  if (single) printf "Seconds where only one of the two internet servers dropped a ping: %d (normal noise, not counted as an outage).\n", single
  printf "\n"

  printf "## Wi-Fi signal\n\n"
  if (wv) {
    printf "- Signal (RSSI): median %d dBm, worst %d dBm, best %d dBm. Below -70 dBm (weak): %.0f%% of samples.\n", rmed, wmin, wmax, 100 * wweak / wv
    if (snrv) printf "- Signal-to-noise: median %d dB; below 20 dB (poor): %.0f%% of samples.\n", smed, 100 * snrlow / snrv
    if (txv) printf "- Link speed (Tx rate): median %d Mbps, lowest %d Mbps.\n", txmed, txmin
    printf "- Channel changes: %d. Access-point changes (roams): %s.\n", chchg + 0, (M["BSSID_OK"] == "1") ? roams + 0 : "not visible (run with sudo to see)"
    for (k = 1; k <= roams && k <= 10; k++) printf "  - roam at %s\n", ROAMAT[k]
    printf "- Guide: better than -60 dBm is good, -60 to -70 fair, below -70 weak. SNR above 25 dB is good, below 20 dB poor.\n"
    if (wna) printf "- Samples with Wi-Fi not associated: %d.\n", wna
  } else printf "No Wi-Fi signal data (Wi-Fi off, wired connection, or the signal reader was unavailable).\n"
  printf "\n"

  printf "## Disconnections, DNS and web checks\n\n"
  printf "- Wi-Fi drops (interface inactive, no IP or no router): %d", drops + 0
  for (k = 1; k <= drops && k <= 10; k++) printf "%s%s", (k == 1 ? " at " : ", "), DROPAT[k]
  printf ". IP address changes: %d.\n", ipchg + 0
  split("sys_cached sys_fresh ctl_fresh", DL, " ")
  DLN["sys_cached"] = "Your DNS, popular name"; DLN["sys_fresh"] = "Your DNS, uncached name"; DLN["ctl_fresh"] = "Control DNS 1.1.1.1, uncached name"
  for (k = 1; k <= 3; k++) { l = DL[k]; if (!dn[l]) continue
    printf "- %s: %d queries, %d failed (timeout %d, servfail %d), slow (> 1 s) %d, average %.0f ms.\n", DLN[l], dn[l], df[l] + 0, dfk[l, "timeout"] + 0, dfk[l, "servfail"] + 0, dslow[l] + 0, dok[l] ? ds[l] / dok[l] : 0 }
  if (df["sys_fresh"] + df["sys_cached"] > 0 && df["ctl_fresh"] == 0) printf "  Your DNS failed while 1.1.1.1 kept working: points at the router or ISP DNS server.\n"
  printf "- Web check (captive.apple.com every 30 s): %d checks, %d failed, %d slow (> 3 s).\n", nh, hf + 0, hslow + 0
  if (pauses) { printf "- Monitoring paused %d time(s) (Mac asleep?): ", pauses; for (k = 1; k <= pauses; k++) printf "%s ", PAUSEAT[k]; printf "\n" }
  if (M["SYSLOG_EVENTS"] != "") printf "- macOS Wi-Fi log lines mentioning disassociation/deauth/link-down: %s (see wifi_events.log).\n", M["SYSLOG_EVENTS"]
  printf "\n"

  if (SPD["speed_start.txt"] != "" || SPD["speed_end.txt"] != "") {
    printf "## Speed test (networkQuality)\n\n"
    if (SPD["speed_start.txt"] != "") printf "Start:\n\n%s\n", SPD["speed_start.txt"]
    if (SPD["speed_end.txt"] != "") printf "End:\n\n%s\n", SPD["speed_end.txt"]
  }

  printf "## Problem periods (timestamps)\n\n"
  if (nreal == 0) printf "None.\n\n"
  else {
    printf "| # | Start | End | Sec | Router lost/slow | Internet lost/slow | ISP hop lost | DNS fail | Worst RSSI | Likely cause |\n|---|---|---|---|---|---|---|---|---|---|\n"
    shown = 0
    for (k = 1; k <= ninc; k++) {
      if (IC[k] == "blip") continue
      if (++shown > 60) { printf "\n(%d more periods not listed)\n", nreal - 60; break }
      printf "| %d | %s | %s | %d | %d/%d | %d/%d | %s | %d | %s | %s |\n", shown, HMS[IS[k]], HMS[IE[k]], IE[k] - IS[k] + 1, Igl[k] + 0, Igs[k] + 0, Iil[k] + 0, Iis[k] + 0, ("isp" in TG) ? Iisp[k] + 0 : "-", Idf[k] + 0, (IR[k] == "" ? "-" : IR[k] " dBm"), CS2[IC[k]]
    }
    printf "\n"
  }

  printf "## Minute-by-minute\n\n`!!` marks a minute with problems. Router/Internet columns: lost pings, worst ms.\n\n| Time | Router lost | Router worst | Internet lost | Internet worst | DNS fails | Weakest RSSI | |\n|---|---|---|---|---|---|---|---|\n"
  for (mm = int(T0 / 60); mm <= int(T1 / 60); mm++) {
    if (!(mm in ML)) continue
    printf "| %s | %d | %s | %d | %s | %d | %s | %s |\n", ML[mm], MGL[mm] + 0, (MGM[mm] == "" ? "-" : sprintf("%.0f", MGM[mm])), MIL[mm] + 0, (MIM[mm] == "" ? "-" : sprintf("%.0f", MIM[mm])), MDF[mm] + 0, (MR[mm] == "" ? "-" : MR[mm]), (MB[mm] ? "!!" : "")
  }
  printf "\nFiles: ping_*.log, wifi.log, dns.log, link.log, http.log, snapshot.txt (raw data for this report).\n"

  # machine-readable summary for --compare
  S = OUTDIR "/summary.tsv"
  printf "duration_min\t%.1f\n", dur > S
  printf "router_loss_pct\t%s\nrouter_median_ms\t%s\nrouter_p95_ms\t%s\nrouter_spikes_per_hour\t%.1f\n", lossp("gw"), r1(med["gw"]), r1(p95["gw"]), (dur ? SPK["gw"] * 60 / dur : 0) > S
  il1 = 0; for (ts = T0; ts <= T1; ts++) if (seen[ts] && isbad("inet1", ts) && isbad("inet2", ts)) il1++
  printf "internet_loss_pct\t%.1f\ninternet_median_ms\t%s\ninternet_p95_ms\t%s\ninternet_spikes_per_hour\t%.1f\n", secs ? 100 * il1 / secs : 0, r1(med["inet1"]), r1(p95["inet1"]), (dur ? SPK["inet1"] * 60 / dur : 0) > S
  printf "dns_fail_pct\t%.1f\n", (dn["sys_fresh"] ? 100 * (df["sys_fresh"] + df["sys_cached"]) / (dn["sys_fresh"] + dn["sys_cached"]) : 0) > S
  printf "wifi_drops\t%d\nproblem_periods_per_hour\t%.1f\nproblem_seconds_pct\t%.1f\n", drops, dur ? nreal * 60 / dur : 0, (secs ? 100 * badsec / secs : 0) > S
  printf "rssi_median_dbm\t%s\nsnr_median_db\t%s\ntx_rate_median_mbps\t%s\n", (wv ? rmed : "-"), (snrv ? smed : "-"), (txv ? txmed : "-") > S
}
AWK_EOF

# Metrics where a higher number is better (for --compare).
read -r -d '' COMPARE_AWK <<'AWK_EOF'
FNR == NR { A[$1] = $2; order[++n] = $1; next }
{ B[$1] = $2 }
END {
  hb["rssi_median_dbm"] = 1; hb["snr_median_db"] = 1; hb["tx_rate_median_mbps"] = 1
  printf "# Before / after comparison\n\n| Metric | Before | After | Result |\n|---|---|---|---|\n"
  for (i = 1; i <= n; i++) { k = order[i]; a = A[k]; b = B[k]; v = ""
    if (k != "duration_min" && a != "-" && b != "-" && a != "" && b != "") {
      d = b - a; if (d == 0) v = "same"; else if ((d < 0 && !hb[k]) || (d > 0 && hb[k])) v = "better"; else v = "worse" }
    printf "| %s | %s | %s | %s |\n", k, a, b, v }
  printf "\nCompare runs of similar length, at a similar time of day: intermittent faults vary by hour.\n"
}
AWK_EOF

analyze() { # DIR
  local d=$1 files f
  files=""
  for f in meta.env ping_gw.log ping_modem.log ping_isp.log ping_inet1.log ping_inet2.log wifi.log dns.log link.log http.log wifi_profile_start.txt speed_start.txt speed_end.txt; do
    [ -s "$d/$f" ] && files="$files $d/$f"
  done
  # shellcheck disable=SC2086
  awk -v OUTDIR="$d" "$ANALYZE_AWK" $files > "$d/report.md"
}

if [ "$MODE" = analyze ]; then
  [ -d "$A_DIR" ] || { echo "No such folder: $A_DIR" >&2; exit 1; }
  analyze "$A_DIR"; echo "Report: $A_DIR/report.md"; exit 0
fi
if [ "$MODE" = compare ]; then
  for d in "$A_DIR" "$B_DIR"; do [ -d "$d" ] || { echo "No such folder: $d" >&2; exit 1; }; [ -s "$d/summary.tsv" ] || analyze "$d"; done
  awk "$COMPARE_AWK" "$A_DIR/summary.tsv" "$B_DIR/summary.tsv" > "$B_DIR/comparison.md"
  cat "$B_DIR/comparison.md"; echo; echo "Saved: $B_DIR/comparison.md"; exit 0
fi

# ------------------------------------------------------------------ Phase 1: detect
[ "$(uname)" = Darwin ] || { echo "This script runs on macOS." >&2; exit 1; }
IS_ROOT=0; [ "$(id -u)" = 0 ] && IS_ROOT=1

is_private() { case $1 in 10.*|192.168.*|172.1[6-9].*|172.2[0-9].*|172.3[01].*) return 0;; esac; return 1; }

WIFI_DEV=$(networksetup -listallhardwareports 2>/dev/null | awk '/^Hardware Port: (Wi-Fi|AirPort)/{f=1;next} f&&/^Device:/{print $2;exit}')
WIFI_DEV=${WIFI_DEV:-en0}
WIFI_SERVICE=$(networksetup -listallhardwareports 2>/dev/null | awk -v d="$WIFI_DEV" '/^Hardware Port:/{sub(/^Hardware Port: /,"");p=$0} /^Device:/&&$2==d{print p;exit}')
DEFAULT_IF=$(route -n get default 2>/dev/null | awk '/interface:/{print $2}')
GW=$(ipconfig getoption "$WIFI_DEV" router 2>/dev/null)
[ -z "$GW" ] && GW=$(route -n get default 2>/dev/null | awk '/gateway:/{print $2}')
MY_IP=$(ipconfig getifaddr "$WIFI_DEV" 2>/dev/null)
DNS=$(scutil --dns 2>/dev/null | awk '/nameserver\[[0-9]+\]/{print $3}' | awk '!s[$0]++' | head -4 | tr '\n' ' ' | sed 's/ *$//')
DNS1=${DNS%% *}; [ -z "$DNS1" ] && DNS1=$GW
SSID=$(ipconfig getsummary "$WIFI_DEV" 2>/dev/null | awk '/^ *SSID :/{sub(/^ *SSID : /,"");print;exit}')
[ -z "$SSID" ] && SSID=$(networksetup -getairportnetwork "$WIFI_DEV" 2>/dev/null | sed 's/^Current Wi-Fi Network: //')
[ -z "$SSID" ] && SSID="(hidden by macOS privacy)"

[ -z "$GW" ] && { echo "No router found: is Wi-Fi connected?" >&2; exit 1; }

echo "Finding the path to the internet (traceroute, ~5 s)..."
MODEM=""; ISP=""
TR=$(traceroute -n -m 6 -q 1 -w 1 1.1.1.1 2>/dev/null)
while read -r hop ip _; do
  case $ip in ''|'*'|1.1.1.1) continue;; esac
  [ "$ip" = "$GW" ] && continue
  if is_private "$ip"; then [ -z "$MODEM" ] && MODEM=$ip; else ISP=$ip; break; fi
done <<EOF
$TR
EOF

# Wi-Fi signal reader: CoreWLAN through JavaScript for Automation (no install, no admin).
read -r -d '' JXA <<'JS_EOF'
ObjC.import("CoreWLAN");
function u(x){try{if(x===undefined||x===null)return "-";if(typeof x==="object"){if(x.isNil&&x.isNil())return "-";x=ObjC.unwrap(x);}if(x===undefined||x===null||x==="")return "-";return String(x);}catch(e){return "-";}}
var i=$.CWWiFiClient.sharedWiFiClient.interface;
var c="-",b="-",w="-";
try{var ch=i.wlanChannel;if(!(ch.isNil&&ch.isNil())){c=u(ch.channelNumber);b=({1:"2.4",2:"5",3:"6"})[u(ch.channelBand)]||"-";w=({1:"20",2:"40",3:"80",4:"160"})[u(ch.channelWidth)]||"-";}}catch(e){}
[u(i.rssiValue),u(i.noiseMeasurement),u(i.transmitRate),c,b,w,u(i.bssid)].join(" ");
JS_EOF

wifi_wdutil() {
  wdutil info 2>/dev/null | awk '
    { i=index($0," : "); if(!i) next; k=substr($0,1,i-1); v=substr($0,i+3); gsub(/^ +| +$/,"",k); gsub(/^ +| +$/,"",v) }
    k=="RSSI"&&r==""{r=v+0} k=="Noise"&&n==""{n=v+0} k=="Tx Rate"&&t==""{t=v+0} k=="BSSID"&&bs==""{bs=v}
    k=="Channel"&&ch==""{ch=v}
    END{ b="-";w="-";c="-"; if(ch!=""){ if(ch~/^2g/)b="2.4"; else if(ch~/^5g/)b="5"; else if(ch~/^6g/)b="6"; c=ch; sub(/^[0-9]g/,"",c); split(c,p,"/"); c=p[1]; if(p[2]!="")w=p[2] }
      if(bs==""||bs~/redacted|None/)bs="-"; print (r==""?"-":r), (n==""?"-":n), (t==""?"-":t), c, b, w, bs }'
}
wifi_profiler() {
  system_profiler SPAirPortDataType 2>/dev/null | awk '
    /Current Network Information:/{c=1;next} c&&/Other Local Wi-Fi Networks:/{exit}
    c&&/Signal \/ Noise:/{s=$0;sub(/.*Noise: */,"",s);r=s;sub(/ dBm.*/,"",r);nn=s;sub(/.*\/ */,"",nn);sub(/ dBm.*/,"",nn)}
    c&&/Channel:/{ch=$2; b=$3; gsub(/[(,]/,"",b); sub(/GHz/,"",b); if(b=="2")b="2.4"; w=$4; gsub(/[^0-9]/,"",w)}
    c&&/Transmit Rate:/{t=$3}
    END{print (r==""?"-":r),(nn==""?"-":nn),(t==""?"-":t),(ch==""?"-":ch),(b==""?"-":b),(w==""?"-":w),"-"}'
}
WIFI_METHOD=none
if [ "$IS_ROOT" = 1 ] && [ -n "$(wifi_wdutil | awk '$1!="-"')" ]; then WIFI_METHOD=wdutil
elif [ -n "$(osascript -l JavaScript -e "$JXA" 2>/dev/null | awk '$1!="-" && $1!=0')" ]; then WIFI_METHOD=jxa
elif [ -n "$(wifi_profiler | awk '$1!="-"')" ]; then WIFI_METHOD=profiler
fi
wifi_sample() {
  case $WIFI_METHOD in
    wdutil) wifi_wdutil;; jxa) osascript -l JavaScript -e "$JXA" 2>/dev/null;; profiler) wifi_profiler;;
    *) echo "- - - - - - -";;
  esac
}
BSSID_OK=0; [ "$WIFI_METHOD" = wdutil ] && BSSID_OK=1
[ "$WIFI_METHOD" = jxa ] && osascript -l JavaScript -e "$JXA" 2>/dev/null | awk '$7!="-"{f=1} END{exit !f}' && BSSID_OK=1

STAMP=$(date +%Y%m%d-%H%M%S)
DIR="$BASE/run-$STAMP"
[ "$MODE" = snapshot ] && DIR="$BASE/snapshot-$STAMP"
mkdir -p "$DIR" || exit 1

{
  echo "DATE=$(date '+%Y-%m-%d')"
  echo "MACOS=macOS $(sw_vers -productVersion 2>/dev/null)"
  echo "WIFI_DEV=$WIFI_DEV"; echo "WIFI_SERVICE=$WIFI_SERVICE"; echo "DEFAULT_IF=$DEFAULT_IF"
  echo "SSID=$SSID"; echo "MY_IP=$MY_IP"; echo "GW=$GW"; echo "DNS=$DNS"; echo "DNS1=$DNS1"
  echo "MODEM=$MODEM"; echo "ISP=$ISP"; echo "WIFI_METHOD=$WIFI_METHOD"; echo "BSSID_OK=$BSSID_OK"
  echo "T_gw=$GW"; echo "T_modem=$MODEM"; echo "T_isp=$ISP"; echo "T_inet1=1.1.1.1"; echo "T_inet2=8.8.8.8"
} > "$DIR/meta.env"

echo "Taking a snapshot of the network configuration..."
{
  echo "=== $(date)"; sw_vers
  echo; echo "=== Detected"; cat "$DIR/meta.env"
  echo; echo "=== Default route"; route -n get default 2>&1
  echo; echo "=== Interface $WIFI_DEV"; ifconfig "$WIFI_DEV" 2>&1
  echo; echo "=== All interfaces (utun/ipsec/ppp = VPN)"; ifconfig -l
  echo; echo "=== VPN services"; scutil --nc list 2>&1
  echo; echo "=== DHCP"; ipconfig getsummary "$WIFI_DEV" 2>/dev/null | grep -Ei 'ssid|bssid|router|domain_name_server|lease|yiaddr|subnet|security|channel'
  echo; echo "=== DNS (scutil --dns, first resolvers)"; scutil --dns 2>&1 | sed -n '1,30p'
  echo; echo "=== DNS set manually on '$WIFI_SERVICE'"; networksetup -getdnsservers "$WIFI_SERVICE" 2>&1
  echo; echo "=== Proxies"; scutil --proxy 2>&1
  echo; echo "=== Router ARP entry"; arp -n "$GW" 2>&1
  echo; echo "=== Traceroute to 1.1.1.1"; echo "$TR"
  echo; echo "=== Wi-Fi now (method $WIFI_METHOD): rssi noise txrate channel band width bssid"; wifi_sample
  echo; echo "=== Interface error counters"; netstat -I "$WIFI_DEV" 2>&1
} > "$DIR/snapshot.txt" 2>&1
system_profiler SPAirPortDataType > "$DIR/wifi_profile_start.txt" 2>/dev/null

echo
echo "  Wi-Fi network : $SSID ($WIFI_DEV)   active interface: ${DEFAULT_IF:-none}"
echo "  Mac IP        : ${MY_IP:-none}   router: $GW"
echo "  DNS           : ${DNS:-none}"
echo "  Path          : router $GW${MODEM:+ -> modem/2nd router $MODEM}${ISP:+ -> ISP $ISP}"
echo "  Wi-Fi now     : $(wifi_sample)   (rssi noise txrate ch band width bssid; reader: $WIFI_METHOD)"
echo

if [ "$MODE" = snapshot ]; then echo "Snapshot saved: $DIR/snapshot.txt"; exit 0; fi

if [ "$SPEEDTEST" = 1 ] && command -v networkQuality >/dev/null; then
  echo "Speed test (about 20 s)..."; networkQuality -v > "$DIR/speed_start.txt" 2>&1
fi

# ------------------------------------------------------------------ Phase 2: monitor
TARGETS="gw inet1 inet2"
[ -n "$ISP" ] && TARGETS="$TARGETS isp"
[ -n "$MODEM" ] && TARGETS="$TARGETS modem"
host_of() { case $1 in gw) echo "$GW";; modem) echo "$MODEM";; isp) echo "$ISP";; inet1) echo 1.1.1.1;; inet2) echo 8.8.8.8;; esac; }

pingone() { # name ts hms
  local host w r rtt st
  host=$(host_of "$1"); w=2000; [ "$1" = gw ] && w=1000
  r=$(ping -n -c 1 -W "$w" -t 3 "$host" 2>&1)
  case $r in
    *time=*) rtt=${r#*time=}; rtt=${rtt%% ms*}; st=ok;;
    *"No route"*|*"Network is down"*|*"Host is down"*|*"sendto:"*|*"Can't assign"*) st=err; rtt=-;;
    *) st=loss; rtt=-;;
  esac
  echo "$2 $3 $st $rtt" >> "$DIR/ping_$1.log"
}
linkcheck() {
  local st ip gw
  st=$(ifconfig "$WIFI_DEV" 2>/dev/null | awk '/status:/{print $2}')
  ip=$(ipconfig getifaddr "$WIFI_DEV" 2>/dev/null); gw=$(ipconfig getoption "$WIFI_DEV" router 2>/dev/null)
  echo "$1 $2 ${st:--} ${ip:--} ${gw:--}" >> "$DIR/link.log"
}
dnsone() { # ts hms label server name
  local r st ms
  r=$(dig +tries=1 +time=2 @"$4" "$5" A 2>&1)
  case $r in
    *"status: NOERROR"*|*"status: NXDOMAIN"*) st=ok;;
    *"status: SERVFAIL"*) st=servfail;;
    *"timed out"*|*"no servers could be reached"*) st=timeout;;
    *) st=fail;;
  esac
  ms=-; case $r in *"Query time: "*) ms=${r#*Query time: }; ms=${ms%% msec*};; esac
  echo "$1 $2 $3 $st $ms" >> "$DIR/dns.log"
}
dnscheck() {
  dnsone "$1" "$2" sys_cached "$DNS1" www.apple.com &
  dnsone "$1" "$2" sys_fresh "$DNS1" "nm$RANDOM$RANDOM.apple.com" &
  dnsone "$1" "$2" ctl_fresh 1.1.1.1 "nm$RANDOM$RANDOM.apple.com" &
  wait
}
httpcheck() {
  local r
  r=$(curl -s -o /dev/null -m 10 -w '%{http_code} %{time_namelookup} %{time_connect} %{time_total}' http://captive.apple.com/hotspot-detect.html 2>/dev/null)
  echo "$1 $2 ${r:-000 - - -}" >> "$DIR/http.log"
}
wifilog() { echo "$1 $2 $(wifi_sample)" >> "$DIR/wifi.log"; }

STOP=0
trap 'STOP=1' INT TERM
caffeinate -i -w $$ >/dev/null 2>&1 & CAF=$!   # keep the Mac awake while monitoring (lid must stay open)

START=$(date +%s); END=$((START + DURATION * 60)); START_LOG=$(date '+%Y-%m-%d %H:%M:%S')
echo "Monitoring for $DURATION min (Ctrl+C stops early and still writes the report)."
echo "Keep the Mac plugged in, lid open, and use it normally. Data: $DIR"
i=0
while [ "$STOP" = 0 ]; do
  set -- $(date '+%s %H:%M:%S'); now=$1; hms=$2
  [ "$now" -ge "$END" ] && break
  for t in $TARGETS; do pingone "$t" "$now" "$hms" & done
  [ $((i % 5)) = 0 ] && linkcheck "$now" "$hms" &
  [ $((i % 10)) = 0 ] && { wifilog "$now" "$hms" & dnscheck "$now" "$hms" & }
  [ $((i % 30)) = 0 ] && httpcheck "$now" "$hms" &
  if [ $((i % 60)) = 0 ] && [ "$i" -gt 0 ]; then
    gl=$(grep -cv ' ok ' "$DIR/ping_gw.log" 2>/dev/null); il=$(grep -cv ' ok ' "$DIR/ping_inet1.log" 2>/dev/null)
    df=$(grep -cv ' ok ' "$DIR/dns.log" 2>/dev/null)
    printf '  %s  %3d/%d min   lost so far: router %s, internet %s, DNS fails %s   Wi-Fi: %s\n' \
      "$hms" $(( (now - START) / 60 )) "$DURATION" "${gl:-0}" "${il:-0}" "${df:-0}" "$(tail -1 "$DIR/wifi.log" 2>/dev/null | cut -d' ' -f3-6)"
  fi
  i=$((i + 1))
  sleep 1
done
trap - INT TERM
echo "Finishing..."
kill "$CAF" 2>/dev/null
wait 2>/dev/null

echo "Reading the macOS Wi-Fi log for disconnect events (up to a minute)..."
log show --style syslog --start "$START_LOG" --predicate \
  '(process == "airportd" OR process == "kernel" OR subsystem == "com.apple.wifi") AND (eventMessage CONTAINS[c] "disassoc" OR eventMessage CONTAINS[c] "deauth" OR eventMessage CONTAINS[c] "link down" OR eventMessage CONTAINS[c] "linkdown" OR eventMessage CONTAINS[c] "beacon loss")' \
  2>/dev/null | grep -v '^Timestamp' | head -3000 > "$DIR/wifi_events.log"
echo "SYSLOG_EVENTS=$(grep -c . "$DIR/wifi_events.log" 2>/dev/null)" >> "$DIR/meta.env"

if [ "$SPEEDTEST" = 1 ] && command -v networkQuality >/dev/null; then
  echo "Speed test (about 20 s)..."; networkQuality -v > "$DIR/speed_end.txt" 2>&1
fi

analyze "$DIR"
echo
sed -n '1,/^## Your setup/p' "$DIR/report.md" | sed '$d'
echo "Full report: $DIR/report.md"
echo "To share it: open the folder with   open \"$DIR\""
