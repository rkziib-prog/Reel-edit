# netmon: Mac network stability monitor

Read-only. It uses only tools built into macOS and changes no settings (DNS, Wi-Fi, router, firewall,
VPN, proxy). Nothing needs to be installed.

## Run it (Terminal on the MacBook)

```bash
cd ~/Downloads                         # wherever netmon.sh was saved
chmod +x netmon.sh
./netmon.sh --snapshot                 # Phase 1: setup check, about 10 s
./netmon.sh -d 45                      # Phase 2: 45-minute monitor + report
```

- Optional: `sudo ./netmon.sh -d 45` also records which access point (BSSID) the Mac is on, which shows
  roaming between mesh nodes or extenders. It is still read-only.
- Optional: `--speedtest` adds Apple's `networkQuality` at the start and end (about 1 GB of data).
- Keep the Mac plugged in with the lid open and use it normally. Run it when the drops usually happen.
- Ctrl+C stops early and still writes the report.
- Results: `~/netmon/run-<date-time>/report.md` plus the raw logs in the same folder.

## What it measures

| Every | Check | Tells apart |
|---|---|---|
| 1 s | ping router, ISP first hop (and modem if double NAT), 1.1.1.1, 8.8.8.8 | Wi-Fi/home network vs modem vs ISP |
| 5 s | interface status, IP address, router | Wi-Fi disconnects, DHCP problems |
| 10 s | Wi-Fi signal, noise, link rate, channel (CoreWLAN) | weak signal, interference, roaming |
| 10 s | DNS via your DNS server and via 1.1.1.1 | DNS failures vs real outages |
| 30 s | HTTP fetch of captive.apple.com | whether web pages actually load |
| end | macOS Wi-Fi log (disassociation, deauth, link down) | drops the Mac itself saw |

How a problem period is classified:

- Router unreachable or the Wi-Fi link down: **Wi-Fi disconnect**.
- Router slow or losing pings with weak signal (< -70 dBm): **weak signal**; with good signal: **interference / busy router**.
- Router fine but the internet lost: **ISP / line** (or **router-to-modem** if the modem hop fails too).
- Router fine, internet slow but not lost: **line congestion** (a busy line or ISP congestion).
- Pings fine, DNS failing: **DNS**.
- One lost ping on its own is normal and is not counted.

## Phase 4: compare before and after a change

```bash
./netmon.sh --compare ~/netmon/run-BEFORE ~/netmon/run-AFTER
```

Rebuild a report from saved logs: `./netmon.sh --analyze ~/netmon/run-...`
