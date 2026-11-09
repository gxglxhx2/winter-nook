#!/usr/bin/env python3
"""Generate the original pixel reindeer icon. Requires Pillow; the ICNS is bundled."""
import subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw

im=Image.new('RGBA',(64,64))
d=ImageDraw.Draw(im)
r=d.rectangle
def p(points,color): d.polygon(points,fill=color)
d.rounded_rectangle((2,3,61,62),radius=13,fill='#31135c')
for y in range(4,62):
    start,end=(32,14,87),(128,40,127)
    t=(y-4)/57
    for x in range(3,61):
        if im.getpixel((x,y))[3]:
            im.putpixel((x,y),tuple(round(a+(b-a)*t) for a,b in zip(start,end))+(255,))
d.rounded_rectangle((2,3,61,62),radius=13,outline='#f0b754',width=1)
d.rounded_rectangle((3,4,60,61),radius=12,outline='#4d315e',width=1)
for x,y in [(11,14),(17,9),(31,11),(54,20),(51,13),(10,29),(29,17),(53,40),(12,46),(38,8),(16,25)]:
    r((x,y,x,y),fill='#e4c9ed')
r((44,12,48,12),fill='#fff4b4');r((46,10,46,14),fill='#fff4b4')
p([(4,54),(12,50),(23,51),(30,48),(45,48),(57,51),(59,54),(55,59),(50,61),(14,61),(8,58)],'#dbcfef')
p([(6,54),(14,51),(21,52),(34,49),(43,49),(55,51),(58,54),(50,55),(28,56),(13,55)],'#f2e8f8')
# Evergreen with bright lights.
r((44,44,47,51),fill='#89545c')
for y,x in [(19,6),(25,8),(31,10),(37,12)]:
    p([(45,y),(46,y+1),(51,y+7),(45+x,y+11),(48,y+10),(45,y+12),(45-x,y+11),(45-x+2,y+8)],'#065c40')
    p([(45,y+1),(47,y+5),(50,y+8),(48,y+9),(42,y+8),(45-x+1,y+11),(45-x+4,y+7)],'#1ec773')
    d.line((45,y+2,45-x+1,y+9),fill='#b2e6d5',width=1)
for x,y,c in [(45,23,'#ffd873'),(42,28,'#ff5977'),(48,30,'#ffda7d'),(44,35,'#ff9c89'),(50,37,'#f8e48c'),(39,41,'#ff738e'),(47,43,'#a0ebac'),(53,44,'#ffd775')]:
    r((x,y,x+1,y+1),fill=c)
r((42,18,48,18),fill='#ffca61');r((45,15,45,21),fill='#ffdd79');r((44,17,46,19),fill='#ffecb1')
# Large reindeer head and holly scarf.
d.line((20,32,17,21,17,18),fill='#4b253f',width=3)
d.line((18,25,13,22,13,19),fill='#4b253f',width=3)
d.line((30,32,33,21,33,17),fill='#4b253f',width=3)
d.line((32,25,37,22,37,19),fill='#4b253f',width=3)
d.line((16,22,18,26),fill='#d2886a',width=1)
d.line((33,21,32,27),fill='#d2886a',width=1)
p([(17,33),(11,29),(8,30),(9,34),(14,39),(19,38)],'#663746')
p([(10,31),(13,31),(17,35),(14,36)],'#f28893')
p([(30,33),(36,29),(41,30),(40,34),(35,38),(31,37)],'#663746')
p([(39,31),(36,31),(32,35),(35,36)],'#f28893')
p([(19,28),(29,28),(33,31),(35,39),(33,45),(29,49),(20,49),(15,46),(13,41),(14,33)],'#5f3343')
p([(19,29),(29,29),(32,32),(34,39),(32,44),(28,47),(21,47),(16,44),(15,41),(16,33)],'#ee9765')
p([(17,33),(20,30),(28,30),(30,32),(26,35),(18,36)],'#ffb975')
p([(17,41),(20,39),(24,40),(28,39),(32,41),(31,44),(28,46),(21,46),(17,44)],'#ffe7ad')
for x in [19,28]:
    r((x,36,x+1,39),fill='#4b2b3c');r((x,36,x,36),fill='#fff1cf')
r((16,40,18,41),fill='#ff9b96');r((30,40,32,41),fill='#ff9b96')
r((22,40,26,42),fill='#bd294f');r((23,40,24,40),fill='#ff838d')
r((24,44,25,44),fill='#89505a')
p([(18,46),(21,47),(29,47),(33,45),(34,47),(32,50),(31,55),(27,56),(26,51),(19,50),(17,49)],'#dc2853')
r((20,47,30,47),fill='#ff6b7a');r((28,51,31,52),fill='#f87577')
# A ribboned present.
r((42,49,51,54),fill='#b53059');r((41,48,52,50),fill='#f5758a')
r((46,48,47,54),fill='#ffda8c');r((44,46,45,47),fill='#ffda8c');r((48,46,49,47),fill='#ffda8c')

root=Path(__file__).resolve().parent
with tempfile.TemporaryDirectory() as td:
    icons=Path(td)/'WinterNook.iconset'
    icons.mkdir()
    for n in (16,32,128,256,512):
        for mult in (1,2):
            side=n*mult
            name=f'icon_{n}x{n}'+('@2x' if mult==2 else '')+'.png'
            mode=Image.Resampling.NEAREST if side>=64 else Image.Resampling.LANCZOS
            im.resize((side,side),mode).save(icons/name)
    subprocess.run(['iconutil','-c','icns',str(icons),'-o',str(root/'WinterNook.icns')],check=True)
