# MultiChannelEpgScreen-RN

Scrollable horizontal list of epg for multiple channels

## Description

RN screen plugin that works only with a datasource plugin that needs to provide the data for the epg.
It presents the data in a table, with the channel logos on the left and a timebar on the top.


![screenshot](https://github.com/applicaster-plugins/MultiChannelEpgScreen-RN/blob/master/screenshot.png?raw=true)


## DSP integration

The dsp name is set using the plugin configuration.
The plugin is able to use any dsp that has the following methods:

### Channel List

`mydsp://fetchData?type=channel-list`

response:
```
{
  "type": {
    "value": "feed"
  },
  "id": "",
  "title": "Channel list",
  "extensions": {},
  "entry": [
    {
      "type": {
        "value": "feed"
      },
      "id": "puls4",
      "title": "Puls 4",
      "author": {},
      "summary": "",
      "media_group": [
        {
          "type": "image",
          "media_item": [
            {
              "src": "https://psdmw.prosiebensat1puls4.tv/zappn/img/puls4.png",
              "key": "image_base",
              "type": "image"
            }
          ]
        }
      ],
      "extensions": {
        "channel_id": 101
      }
    },
    {
      "type": {
        "value": "feed"
      },
      "id": "servustv",
      "title": "ServusTV",
      "author": {},
      "summary": "",
      "media_group": [
        {
          "type": "image",
          "media_item": [
            {
              "src": "https://psdmw.prosiebensat1puls4.tv/zappn/img/servus.png",
              "key": "image_base",
              "type": "image"
            }
          ]
        }
      ],
      "extensions": {
        "channel_id": 135
      }
    }
  ]
}
```




### EPG

`mydsp://fetchData?type=epg&channelId=135&from=2019-08-11 00:00&to=2019-08-11 23:59`

* `channelId` is the `channel_id` from the `extensions` in the `channel-list` response, will be used by the app to request the epg for each channel 
* `from` and `to` will have this format `YYYY-MM-DD HH:mm` the timezone will be decided by the locale configured for the app
* `from` and `to` will usually have the values to retrieve epg for the whole day. even when requested for today the response should contain already aired programs, but it can respond only with the current and future epg. the app will display blank space in the missing period

```
{
  "type": {
    "value": "feed"
  },
  "id": "",
  "title": "EPG",
  "extensions": {},
  "entry": [
    {
      "type": {
        "value": "program"
      },
      "id": "2424966",
      "title": null,
      "author": {},
      "summary": "\"Herr der Ringe\"-Regisseur Peter Jackson widmet sich in seinem Drama sensibel der Situation einer Familie, die einen schweren Verlust erleidet und daran zu zerbrechen droht. Neben den elegant eingeflochtenen Spannungselementen ist es vor allem die charismatische Hauptdarstellerin, die die Adaption des gleichnamigen Romans von Alice Sebold zu einem fesselnden Filmerlebnis macht: Die Irin Saoirse Ronan, die für ihre Leistung in der Literaturverfilmung \"Abbitte\" bereits im Alter von 13 Jahren für einen Oscar nominiert war, bewegt mit feinsinnigem Spiel und glaubwürdigen Emotionen. Die Musik steuerte Pop-Legende Brian Eno bei.",
      "media_group": [
        {
          "type": "image",
          "media_item": [
            {
              "src": "http://i5-img.7tv.de/pis/mw/7816jq5FgRZkkOu2xJ37ug0BSVjsgJTwENozI8pC4CTJiI-F3d-Emtm8yipNc8gAS5xJgwoIP1yiiutbiHIEed1H9RFa1flWYnMS16QCGVQ/profile:austriantv-16_9_1280x720",
              "key": "image_base",
              "type": "image"
            }
          ]
        }
      ],
      "content": {},
      "extensions": {
        "show_name": "In meinem Himmel",
        "starts_at": "2019/08/10 22:45:00 +0000",
        "ends_at": "2019/08/11 01:05:00 +0000",
        "channel_id": 1
      }
    },
    {
      "type": {
        "value": "program"
      },
      "id": "643944",
      "title": null,
      "author": {},
      "summary": "Das paranormale Grauen um \"The Ring\" geht also weiter: subtil, anspruchsvoll, spannend. Schauspielerisch steht Teil zwei dem ersten in nichts nach. Naomi Watts hat sich mittlerweile zum Star gemausert und David Dorfman zählt zu einem der besten Kinderdarstellern Hollywoods. Besonders edel in seiner Bildsprache hat Regisseur Nakata die Rolle des Wassers als Metapher umgesetzt.",
      "media_group": [
        {
          "type": "image",
          "media_item": [
            {
              "src": "http://i5-img.7tv.de/pis/mw/f654jq5FgRZkkOu2xJ37ug0BSVjsgJTwENozI8pC4CTJiNsi1Vl-4q2d5lEmts1bx9tuQC5_he9ciS4g2GKbjVdS34h5GiNctPnvzBeZKP0/profile:austriantv-16_9_1280x720",
              "key": "image_base",
              "type": "image"
            }
          ]
        }
      ],
      "content": {},
      "extensions": {
        "show_name": "Ring 2",
        "starts_at": "2019/08/11 01:05:00 +0000",
        "ends_at": "2019/08/11 02:55:00 +0000",
        "channel_id": 1
      }
    }
  ]
}
```

* the response should contain the programs ordered by `starts_at` from early to latest
* a program `ends_at` doesn't have to match the next program `starts_at`, the app will handle it by displaying blank space between the two cells
* `show_name` is the name of the series. can be empty, if it's a movie and not a series for example
* `title` will be displayed in the first line of the program cell, it's either the movies name, or the episode title
* the `image` under `media_item`, will be displayed in the program info popup that appears if the user presses on a program cell
* `summary` will also be disaplyed in the program info popup
