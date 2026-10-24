# 공유·오프라인용 단일 파일: standalone_head.html + pe-scoreboard.html → 체육점수판.html
import pathlib
d=pathlib.Path(__file__).parent
(d/"체육점수판.html").write_text((d/"standalone_head.html").read_text()+(d/"pe-scoreboard.html").read_text()+"\n</body>\n</html>\n")
print("standalone ok")
