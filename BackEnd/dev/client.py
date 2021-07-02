
import requests

host = "localhost"
port = 3000

url = "http://" + host + ":" + str(port) + "/stamp"
files = {'file': open("../public/lenna.png", 'rb')}

r = requests.post(url, files = files)
if r.status_code == 200:
    img = r.content
    with open("lenna_watermarked.png", 'wb') as f:
        f.write(img)
else:
    print(r.status_code)
    print(r.text)