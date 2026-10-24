import pathlib
d=pathlib.Path(__file__).parent
js="\n".join((d/f).read_text() for f in ["core.js","records.js","classes.js","bingo.js","fx.js","tips.js","bd_tips.js","vb_tips.js","mod_bb3.js","mod_bb5.js","mod_volley.js","mod_net.js","mod_soccer.js","mod_dodge.js","mod_kin.js","mod_base.js","mod_ult.js","mod_run.js","mod_tchouk.js","mod_netball.js","mod_flag.js","mod_boccia.js","quiz_bank.js","quiz_bank_ext.js","mod_quiz.js","mod_teams.js","mod_bracket.js","mod_paps.js","main.js"])
out=(d/"shell.html").read_text()+"\n<script>\n"+js+"\n</script>\n"
(d/"pe-scoreboard.html").write_text(out)
(d/"all.js").write_text(js)
print(len(out))
