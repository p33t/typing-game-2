# Arketyper
Adaptive random keyboard typing trainer

## Description
A web app for gradually improving typing skill on unfamiliar keyboards.  
![Main Screenshot](docs/screenshot-main.png)
See also [Documentation](docs/index.md)

## Installation
### Online
Published at https://arketyper.freshcode.biz

### Deployment
1. Edit `vit.config.ts` so that __APP_VERSION__ shows up
2. `rm -rf dist && npm run build`
3. Replace relevant content in `../arketyper.freshcode.biz` repo with contents of `dist`
4. Commit and push the adjacent repo
5. Update the version number and commit + push this repo

### Workstation (for development)
1. Clone this repo
2. Install Node 14.17.x (Suggest using NVM)
3. Install typescript: `npm i -g typescript` (test with `tsc -v`)
4. `npm install`
5. Launch with `npm run dev`

## Usage
See [Documentation](docs/index.md).
