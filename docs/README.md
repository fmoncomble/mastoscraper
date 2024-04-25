
![mastologo](https://github.com/fmoncomble/mastoscraper/assets/59739627/15c77ec3-9dba-4e97-868f-984dddd87816)

[(Version française)](https://fmoncomble.github.io/mastoscraper/README_fr.html)

An extension for extracting and downloading toots (posts on Mastodon) for text mining and analysis.  
  
### Cite this program
If you use this extension for your research, please reference it as follows:  
  
Moncomble, F. (2024). *MastoScraper* (Version 0.2) [JavaScript]. Arras, France: Université d'Artois. Available at: https://fmoncomble.github.io/mastoscraper/


## Installation
### Firefox (recommended: automatic updates)
[![Firefox add-on](https://github.com/fmoncomble/Figaro_extractor/assets/59739627/e4df008e-1aac-46be-a216-e6304a65ba97)](https://github.com/fmoncomble/mastoscraper/releases/latest/download/mastoscraper.xpi)  
Remember to pin the add-on to the toolbar.

### Chrome/Edge
While the add-on is being authorized on the Chrome WebStore, you can test it by installing it in developer mode:
- [Download the .zip archive](https://github.com/fmoncomble/mastoscraper/releases/latest/download/mastoscraper.zip)
- Unzip the archive
- Open the extensions manager: `chrome://extensions` or `edge://extensions`
  - Activate "developer mode"
  - Click "Load unpacked"
  - Select the unzipped folder
- Pin the add-on to the toolbar
 
## Instructions for use
- Click the add-on's icon in the toolbar.
- On first using the add-on, follow the authentication procedure to authorize the app on Mastodon. *All credentials are stored locally on your computer, **not** on a remote server.*
- Build your search query with at least one keyword, and click `Search`.
- Choose your preferred output format:
    - `XML/XTZ` for an XML file to import into [TXM](https://txm.gitpages.huma-num.fr/textometrie/en/index.html) using the `XML/TEI-Zero` module
      - When initiating the import process, open the "Textual planes" section and type `ref` in the field labelled "Out of text to edit"
    - `TXT` for plain text
    - `CSV`
    - `JSON`
- (Optional) Enter the maximum number of toots to collect.
- You can stop the process at any time by clicking `Abort`.
- Click `Download` to collect the output or `Reset` to start afresh.
