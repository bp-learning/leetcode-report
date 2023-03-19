const API = 'https://leetcode-stats-api.herokuapp.com/';
const profiles = [
    'bhupendraparihar',
    'neal_wu'
];

const axios = require('axios');
const xl = require('excel4node');

async function getProfilesData() {
    const result = [];
    for (let profile of profiles) {
        console.log(profile);
        const response = await axios.get(API + profile);
        result.push({profile, ...response.data});
    }

    console.log(result);
    return result;
}

async function createExcelReport() {
    var wb = new xl.Workbook();

    var ws = wb.addWorksheet('Sheet 1');

    ws.column(1).setWidth(20);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(20);
    ws.column(6).setWidth(20);

    var style = wb.createStyle({
        font: {
            color: '#000000',
            size: 12,
            bold: true
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#FFFF00',
            fgColor: '#FFFF00',
          }
    });


    ws.cell(1, 1).string("USERNAME").style(style);
    ws.cell(1,2).string("TOTAL_SOLVED").style(style);
    ws.cell(1,3).string("EASY_SOLVED").style(style);
    ws.cell(1,4).string("MEDIUM_SOLVED").style(style);
    ws.cell(1,5).string("HARD_SOLVED").style(style);
    ws.cell(1,6).string("RANKING").style(style);

    const result = await getProfilesData();

    result.forEach((record, index) => {
        ws.cell(index + 2, 1).string(record.profile);
        ws.cell(index + 2, 2).number(record.totalSolved);
        ws.cell(index + 2, 3).number(record.easySolved);
        ws.cell(index + 2, 4).number(record.mediumSolved);
        ws.cell(index + 2, 5).number(record.hardSolved);
        ws.cell(index + 2, 6).number(record.ranking);
    });
    
    wb.write('LeetCode-'+getDateInFormat() + '.xlsx');
}

function getDateInFormat() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '-' + mm + '-' + yyyy;

    return formattedToday;
}

createExcelReport();
