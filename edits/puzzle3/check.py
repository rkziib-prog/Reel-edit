import itertools
P=['Anu','Binu','Chinnu','Dinu']; D=['chaya','kaapi','sulaimani','boost']
sols=[]
for seats in itertools.permutations(range(1,5)):
    s=dict(zip(P,seats))
    for dr in itertools.permutations(D):
        d=dict(zip(P,dr)); who={v:k for k,v in d.items()}
        c=[ s[who['boost']] in (1,4),                    # 1 boost sits at one end
            abs(s['Anu']-s[who['kaapi']])==1,             # 2 Anu sits right next to the kaapi drinker
            s['Binu']==s[who['sulaimani']]+1,             # 3 Binu sits immediately right of the sulaimani drinker
            abs(s['Chinnu']-s['Dinu'])>1,                 # 4 Chinnu and Dinu are NOT next to each other
            d['Chinnu']!='chaya' and s['Chinnu']!=1,      # 5 Chinnu doesn't drink chaya and isn't in seat 1
            s[who['chaya']]==2,
            s['Anu'] not in (1,4),
        ]
        if all(c): sols.append((sorted(s,key=s.get),d))
print(len(sols)); [print(x) for x in sols]
