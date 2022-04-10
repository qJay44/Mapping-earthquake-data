import csv
import urllib.request
import eel

eel.init('web')


# Request form JS
@eel.expose
def fromJS(url):
    response = urllib.request.urlopen(url)
    lines = [l.decode('utf-8') for l in response.readlines()]
    cr = csv.reader(lines)

    eel.toJS([_ for _ in cr])


eel.start('index.html', size=(1920, 1080))
