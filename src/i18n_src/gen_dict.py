# tr/*.tsv(여기 i18n_src/*.tsv) → ../i18n_en.js
import glob,json,os
d=os.path.dirname(os.path.abspath(__file__))
tr={}
for f in sorted(glob.glob(os.path.join(d,"*.tsv"))):
    for ln in open(f,encoding="utf8"):
        ln=ln.rstrip("\n")
        if not ln.strip(): continue
        k,_,v=ln.partition("\t")
        tr[k.replace("&#10;","\n")]=v.replace("&#10;","\n")
tr["태성쌤의 체육수업 점수판"]="Mr. Lee's PE Scoreboard"
tr["[태성쌤의 체육수업 점수판 의견]"]="[Mr. Lee's PE Scoreboard feedback]"
tr["— 태성쌤의 체육수업 점수판 · 수업 작전판"]="— Mr. Lee's PE Scoreboard · Lesson Planner"
js="/* 영어 사전 (자동 생성: i18n_src/*.tsv → gen_dict.py) — "+str(len(tr))+"개 */\nK.I18N_EN="+json.dumps(tr,ensure_ascii=False,separators=(",",":"))+";\n"
open(os.path.join(d,"..","i18n_en.js"),"w",encoding="utf8").write(js)
print("dict",len(tr))
