from PIL import Image, ImageDraw, ImageFont, ImageEnhance
from pathlib import Path
import math

root = Path(__file__).resolve().parents[1]
out = root / 'public/images'
font_path = 'C:/Windows/Fonts/segoeui.ttf'
font = ImageFont.truetype(font_path, 12)
small = ImageFont.truetype(font_path, 10)
bold = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 15)
source = Image.open(out / 'founder.webp').convert('RGB')
frames = []
def text(d, xy, value, fill='#b6bdcb', f=font):
    d.text(xy, value, font=f, fill=fill)

for i in range(64):
    im = Image.new('RGB', (720, 460), '#101217')
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 720, 30), fill='#20232c')
    text(d, (14, 6), 'ATL  /  EDITING WORKSPACE', '#e8edf8', bold)
    text(d, (484, 9), 'Edit    Color    Audio    Export', f=small)
    d.rectangle((12, 42, 171, 284), fill='#181b23')
    text(d, (24, 50), 'PROJECT MEDIA', '#edf0f8', small)
    for j, name in enumerate(['Interview - Take 01', 'B-roll - Detail', 'Music - Ambient']):
        y = 78 + j * 63
        d.rounded_rectangle((23, y, 65, y + 44), 4, fill=['#7859b4','#427b9c','#418b74'][j])
        text(d, (73, y+6), name.split(' - ')[0], f=small)
        text(d, (73, y+22), name.split(' - ')[1], '#737e94', small)
    d.rectangle((183, 42, 536, 284), fill='#090a0d')
    phase = i / 63
    zoom = 1.0 + .06 * math.sin(phase*math.pi)
    photo = source.copy()
    ratio = max(344/photo.width, 200/photo.height) * zoom
    photo = photo.resize((int(photo.width*ratio), int(photo.height*ratio)))
    x = (photo.width-344)//2
    y = max(0, (photo.height-200)//3)
    photo = photo.crop((x,y,x+344,y+200))
    if i >= 32:
        photo = ImageEnhance.Color(photo).enhance(1.25)
        photo = ImageEnhance.Contrast(photo).enhance(1.12)
    im.paste(photo, (188, 64))
    d = ImageDraw.Draw(im)
    text(d, (194, 46), 'PROGRAM PREVIEW', f=small)
    text(d, (290, 266), f'00:00:{i//8:02d}:{i%8*3:02d}', '#e4e8ee', small)
    d.rectangle((548, 42, 708, 284), fill='#181b23')
    text(d, (560, 50), 'COLOR & FINISH', '#edf0f8', small)
    for j, label in enumerate(['Exposure', 'Contrast', 'Saturation']):
        y=85+j*48
        text(d, (561,y), label, f=small)
        d.line((561,y+23,693,y+23), fill='#424958', width=3)
        knob = 610 + (min(max(i-32,0),16) if j else 0)
        d.ellipse((knob-4,y+19,knob+4,y+27),fill='#ff9659')
    text(d,(560,242),'Color grade applied' if i>=32 else 'Original footage', '#74d6b2',small)
    text(d,(15,296),'TIMELINE / STORY SEQUENCE', '#edf0f8',small)
    for x in range(92,700,60):
        text(d,(x,316),f'00:{(x-92)//60:02d}',f=small)
        d.line((x,334,x,446),fill='#252a35')
    for j, label in enumerate(['V2  Titles','V1  Video','A1  Audio']):
        text(d,(14,347+j*34),label,f=small)
    d.rounded_rectangle((252,343,410,365),4,fill='#9465bc')
    text(d,(261,347),'INTERVIEW / INTRO', '#fff',small)
    cut = i >= 18
    clips = [(92,277,'TAKE 01'),(281,475,'TAKE 02'),(479,698,'B-ROLL')] if cut else [(92,475,'INTERVIEW / TAKE 01'),(479,698,'B-ROLL')]
    for a,b,label in clips:
        d.rounded_rectangle((a,377,b,399),3,fill='#346da3')
        text(d,(a+8,382),label,'#f4f8ff',small)
    d.rounded_rectangle((92,411,698,438),3,fill='#275c49')
    for x in range(96,694,3):
        h=4+abs(math.sin(x*.23)*math.cos(x*.07))*17
        d.line((x,424-h/2,x,424+h/2),fill='#6fcba5')
    playhead=100+int(phase*585)
    d.line((playhead,333,playhead,444),fill='#ff9659',width=2)
    d.polygon([(playhead-5,330),(playhead+5,330),(playhead,337)],fill='#ff9659')
    if 14<=i<=24:
        d.line((279,370,279,404),fill='#fff',width=2)
        text(d,(290,352),'CUT', '#ffca8f',bold)
    if 36<=i<=55:
        d.rounded_rectangle((205,224,515,250),5,fill='#11151e')
        text(d,(246,230),'YOUR STORY. BEAUTIFULLY EDITED.', '#ffffff', small)
    frames.append(im)

frames[0].save(out/'editing-workflow.jpg', quality=90)
frames[0].save(out/'editing-workflow.gif',save_all=True,append_images=frames[1:],duration=125,loop=0,optimize=True)
print('Created editing-workflow.gif:', (out/'editing-workflow.gif').stat().st_size, 'bytes')
