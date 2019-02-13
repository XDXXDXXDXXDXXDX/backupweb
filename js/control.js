// let longClick = 0;
// let timeOutEvent = '';

$(() => {
    if(localStorage.treasuryData) {
        let treasuryDataArr = JSON.parse(localStorage.treasuryData);
        for(let data of treasuryDataArr) {
            if(data.type == 0) {
                appendAssetsItem(data.id, data.name, data.value)
            }else{
                appendCreditItem(data.id, data.name, data.value, data.waitVal, data.alreadyVal, data.leftTime)
            }
        }
        updateTotal();
    }
    if(localStorage.bankName) {
        $('.bank-name').val(localStorage.bankName);
    }
});

$('.bank-name').change(() => {
    localStorage.bankName = $('.bank-name').val();
})

// let clearData = 0;
// $('body').click(showClearData);

// function showClearData() {
//     clearData++;
//     if(clearData == 10) {
//         $('.clear-data').fadeIn();
//         clearData = 0;
//         $('body').unbind('click', showClearData);
//     }
// }

function clearData() {
    localStorage.treasuryData = '';
    location.reload();
}

function appendAssetsItem(id, name, value) {
    $('.assets').append(`
        <div id="${id}" class="assets-item">
            <span class="assets-name-2">${name}</span>
            <span class="assets-val-2">￥${toMoney(value)}</span>
        </div>
    `);
    // <input class="assets-val-2" value="￥${toMoney(value)}">

    $(`#${id}`).click(function() {
        $('.chart-action').fadeIn();

        $('.delete-chart').unbind();
        $('.delete-chart').click(function() {
            deleteRow(`${id}`);
        });

        $('.update-chart').unbind();
        $('.update-chart').click(function() {
            updateChart(id, 0);
        });
    });
    
    // $(`.${name}-${value}`).on({
    //     touchstart: function(e){
    //         e.preventDefault();
    //         $('.delete-chart').unbind();
    //         $('.delete-chart').click(function() {
    //             deleteRow(`${name}-${value}`)
    //         });
    //         timeOutEvent = setTimeout(function() {
    //             $('.chart-action').fadeIn()
    //             // longClick = 1;//假如长按，则设置为1
    //         }, 500);
    //     },
    //     touchmove: function(e){
    //         clearTimeout(timeOutEvent);
    //         timeOutEvent = 0;
    //         // e.preventDefault();
    //     },
    //     touchend: function(e){
    //         // e.preventDefault();
    //         clearTimeout(timeOutEvent);
    //         // if(longClick == 1){
    //         //     $('.chart-action').fadeIn()
    //         // }
    //         return false;
    //     }
    // }); 

    // $(`.assets-val-2`).on({
    //     touchstart: function(e) {
    //         e.stopPropagation();
    //     },
    //     click: function(e) {
    //         e.stopPropagation();
    //     },
    //     focus: function(e) {
    //         $(e.target).val((i, val) => {
    //             return toNumber(val);
    //         })
    //     },
    //     blur: function(e) {
    //         $(e.target).val((i, val) => {
    //             return `￥${toMoney(val)}`;
    //         });

    //         updateStorage('update', {
    //             type: 0, // 0资产类 1信用卡类
    //             name: $(e.target).prev().html(), // 名称
    //             value: toNumber($(e.target).val()) // 余额 / 额度
    //         });
    //     }
    // }); 
}

function appendCreditItem(id, name, value, waitVal, alreadyVal, leftTime) {
    $('.credit').append(`
        <div id="${id}" class="credit-item">
            <p class="credit-name-2">${name}</p>
            <p>
                <span>剩余余额</span>
                <span class="credit-val-2 val-2">￥${toMoney(value)}</span>
            </p>
            <p>
                <span>待还金额</span>
                <span class="wait-val-2 val-2">￥${toMoney(waitVal)}</span>
            </p>
            <p>
                <span>出帐待还</span>
                <span class="already-val-2 val-2">￥${toMoney(alreadyVal)}</span>
            </p>
            <p>
                <span>剩余期数</span>
                <span class="left-time-2 val-2">${leftTime}</span>
            </p>
        </div>
    `);
    // <input class="credit-val-2 val-2" value="￥${toMoney(value)}"></input>

    $(`#${id}`).click(function() {
        $('.chart-action').fadeIn();

        $('.delete-chart').unbind();
        $('.delete-chart').click(function() {
            deleteRow(id);
        });

        $('.update-chart').unbind();
        $('.update-chart').click(function() {
            updateChart(id, 1);
        });
    });

    

    // $(`.${name}-${value}`).on({
    //     touchstart: function(e){
    //         e.preventDefault();
    //         $('.delete-chart').unbind();
    //         $('.delete-chart').click(function() {
    //             deleteRow(`${name}-${value}`)
    //         });
    //         timeOutEvent = setTimeout(function() {
    //             $('.chart-action').fadeIn()
    //             // longClick = 1;//假如长按，则设置为1
    //         }, 500);
    //     },
    //     touchmove: function(e){
    //         clearTimeout(timeOutEvent);
    //         timeOutEvent = 0;
    //         // e.preventDefault();
    //     },
    //     touchend: function(e){
    //         // e.preventDefault();
    //         clearTimeout(timeOutEvent);
    //         // if(longClick == 1){
    //         //     $('.chart-action').fadeIn()
    //         // }
    //         return false;
    //     }
    // }); 

    // $(`.val-2`).on({
    //     touchstart: function(e) {
    //         e.stopPropagation();
    //     },
    //     click: function(e) {
    //         e.stopPropagation();
    //     },
    //     focus: function(e) {
    //         $(e.target).val((i, val) => {
    //             return toNumber(val);
    //         })
    //     },
    //     blur: function(e) {
    //         $(e.target).val((i, val) => {
    //             return `￥${toMoney(val)}`;
    //         });

    //         let targetClass = $(e.target).parents('.credit-item').attr('class').replace('credit-item ', '');

    //         updateStorage('update', {
    //             type: 1, // 0资产类 1信用卡类
    //             name: $(`.${targetClass} .credit-name-2`).html(), // 名称
    //             value: toNumber($(`.${targetClass} .credit-val-2`).val()), // 余额 / 额度
    //             waitVal: toNumber($(`.${targetClass} .wait-val-2`).val()), // 待还
    //             alreadyVal: toNumber($(`.${targetClass} .already-val-2`).val()), // 已出账
    //             leftTime: $(`.${targetClass} .left-time-2`).val() // 剩余期数
    //         });
    //     }
    // }); 
}

// $('.confirm-chart').click(addAssets);
function updateChart(id, type) {
    if(type == 0) {
        $('body').append(
            `<div class="new-chart1 update-chart-box" style="display:block">
                <div class="chart-ctn">
                    <div class="item-ctn">
                        <input type="text" placeholder="NAME" class="assets-name2" value="${$(`#${id} .assets-name-2`).html()}">
                        <input type="number" placeholder="额度/剩余额度" class="assets-val2" value="${toNumber($(`#${id} .assets-val-2`).html())}">
                    </div>
                    <div class="chart-ctn-btn-group">
                        <button class="cancel-chart" onclick="$('.update-chart-box').remove()">取&nbsp;&nbsp;消</button>
                        <button class="confirm-chart" onclick="updateAssets(${id})">确&nbsp;&nbsp;认</button>
                    </div>
                </div>
            </div>`
        );
    }else{
        $('body').append(
            `<div class="new-chart2 update-chart-box" style="display:block">
                <div class="chart-ctn">
                    <div class="item-ctn">
                        <input type="text" placeholder="NAME" class="credit-name2" value="${$(`#${id} .credit-name-2`).html()}">
                        <input type="number" placeholder="额度/剩余额度" class="credit-val2" value="${toNumber($(`#${id} .credit-val-2`).html())}">
                        <input type="number" placeholder="待还金额" class="wait-val2" value="${toNumber($(`#${id} .wait-val-2`).html())}">
                        <input type="number" placeholder="出帐待还" class="already-val2" value="${toNumber($(`#${id} .already-val-2`).html())}">
                        <input type="number" placeholder="剩余期数" class="left-time2" value="${$(`#${id} .left-time-2`).html()}">
                    </div>
                    <div class="chart-ctn-btn-group">
                        <button class="cancel-chart" onclick="$('.update-chart-box').remove()">取&nbsp;&nbsp;消</button>
                        <button class="confirm-chart" onclick="updateCredit(${id})">确&nbsp;&nbsp;认</button>
                    </div>
                </div>
            </div>`
        );
    } 
}

function updateAssets(id) {
    $(`#${id} .assets-name-2`).html($('.assets-name2').val());
    $(`#${id} .assets-val-2`).html(`￥${toMoney($('.assets-val2').val())}`);

    updateStorage('update', {
        id: id,
        type: 0, // 0资产类 1信用卡类
        name: $('.assets-name2').val(), // 名称
        value: $('.assets-val2').val() // 余额 / 额度
    });

    $('.update-chart-box').remove()
    $('.chart-action').fadeOut();
}

function updateCredit(id) {
    $(`#${id} .credit-name-2`).html($('.credit-name2').val());
    $(`#${id} .credit-val-2`).html(`￥${toMoney($('.credit-val2').val())}`);
    $(`#${id} .wait-val-2`).html(`￥${toMoney($('.wait-val2').val())}`);
    $(`#${id} .already-val-2`).html(`￥${toMoney($('.already-val2').val())}`);
    $(`#${id} .left-time-2`).html($('.left-time2').val());

    updateStorage('update', {
        id: id,
        type: 1, // 0资产类 1信用卡类
        name: $('.credit-name2').val(), // 名称
        value: $('.credit-val2').val(), // 余额 / 额度
        waitVal: $('.wait-val2').val(), // 待还
        alreadyVal: $('.already-val2').val(), // 已出账
        leftTime: $('.left-time2').val() // 剩余期数
    });

    $('.update-chart-box').remove()
    $('.chart-action').fadeOut();
}
// $('#trueMoney').change(function() {
//     $('.item-ctn').remove();
//     $('.chart-ctn').prepend(`
//         <div class="item-ctn">
//             <input type="text" placeholder="NAME" class="assets-name">
//             <input type="text" placeholder="额度/剩余额度" class="assets-val">
//         </div>
//     `);

//     $('.confirm-chart').unbind();
//     $('.confirm-chart').click(addAssets);
// });
// $('#creditMoney').change(function() {
//     $('.item-ctn').remove();
//     $('.chart-ctn').prepend(`
//         <div class="item-ctn">
//             <input type="text" placeholder="NAME" class="credit-name">
//             <input type="text" placeholder="额度/剩余额度" class="credit-val">
//             <input type="text" placeholder="待还金额" class="wait-val">
//             <input type="text" placeholder="出帐待还" class="already-val">
//             <input type="text" placeholder="剩余期数" class="left-time">
//         </div>
//     `);
//     $('.confirm-chart').unbind();
//     $('.confirm-chart').click(addCredit);
// });

function addAssets() {
    let id = Date.now();
    appendAssetsItem(id, $('.assets-name').val(), $('.assets-val').val())

    $('.new-chart').fadeOut();

    updateStorage('add', {
        id: id,
        type: 0, // 0资产类 1信用卡类
        name: $('.assets-name').val(), // 名称
        value: $('.assets-val').val() // 余额 / 额度
    });

    $('.new-chart1').fadeOut();
    clearIuput();
}

function addCredit() {
    let id = Date.now();
    appendCreditItem(id, $('.credit-name').val(), $('.credit-val').val(), $('.wait-val').val(), $('.already-val').val(), $('.left-time').val())

    $('.new-chart').fadeOut();

    updateStorage('add', {
        id: id,
        type: 1, // 0资产类 1信用卡类
        name: $('.credit-name').val(), // 名称
        value: $('.credit-val').val(), // 余额 / 额度
        waitVal: $('.wait-val').val(), // 待还
        alreadyVal: $('.already-val').val(), // 已出账
        leftTime: $('.left-time').val() // 剩余期数
    })

    $('.new-chart2').fadeOut();
    clearIuput();
}

function deleteRow(rowId) {
    updateStorage('delete', {
        id: rowId
        // type: $(`.${rowClass}`).hasClass("assets-item") ? 0 : 1, // 0资产类 1信用卡类
        // name: $(`.${rowClass} .assets-name-2`).html() || $(`.${rowClass} .credit-name-2`).html(), // 名称
        // value: toNumber($(`.${rowClass} .assets-val-2`).val()) || toNumber($(`.${rowClass} .credit-val-2`).val()), // 余额 / 额度
        // waitVal: toNumber($(`.${rowClass} .wait-val-2`).val()), // 待还
        // alreadyVal: toNumber($(`.${rowClass} .already-val-2`).val()), // 已出账
        // leftTime: $(`.${rowClass} .left-time-2`).val() // 剩余期数
    })

    $(`#${rowId}`).remove();

    $('.chart-action').fadeOut()
}

//status add增加 delete删除; data 数据
/*
data = {
    id: 0, //时间戳，唯一识别id
    type: 0, // 0资产类 1信用卡类
    name: '', // 名称
    value: 0, // 余额 / 额度
    waitVal: 0, // 待还
    alreadyVal: 0, // 已出账
    leftTime: 0 // 剩余期数
}
*/
function updateStorage(status, data) {
    updateTotal();

    if(status == 'add') {
        if(localStorage.treasuryData) {
            let treasuryDataArr = JSON.parse(localStorage.treasuryData);
            treasuryDataArr.push(data);
            localStorage.treasuryData = JSON.stringify(treasuryDataArr);
        }else{
            let treasuryDataArr = [];
            treasuryDataArr.push(data);
            localStorage.treasuryData = JSON.stringify(treasuryDataArr);
        }
    }else if(status == 'delete') {
        let treasuryDataArr = JSON.parse(localStorage.treasuryData);
        for(let [index, value] of treasuryDataArr.entries()) {
            if(data.id == value.id) {
                treasuryDataArr.splice(index, 1);
                break;
            }
            // if(data.type == 0) {
            //     if(value.name == data.name && value.type == data.type && value.value == data.value) {
            //         treasuryDataArr.splice(index, 1);
            //         break;
            //     }
            // }else{
            //     if(value.name == data.name && value.type == data.type && value.value == data.value && value.waitVal == data.waitVal && value.alreadyVal == data.alreadyVal && value.leftTime == data.leftTime) {
            //         treasuryDataArr.splice(index, 1);
            //         break;
            //     }
            // }
        }
        localStorage.treasuryData = JSON.stringify(treasuryDataArr);
    }else if(status == 'update') {
        let treasuryDataArr = JSON.parse(localStorage.treasuryData);
        for(let [index, value] of treasuryDataArr.entries()) {
            if(data.id == value.id) {
                if(data.type == 0) {
                    treasuryDataArr[index].name = data.name;
                    treasuryDataArr[index].value = data.value;
                    break;
                }else{
                    treasuryDataArr[index].name = data.name;
                    treasuryDataArr[index].value = data.value;
                    treasuryDataArr[index].waitVal = data.waitVal;
                    treasuryDataArr[index].alreadyVal = data.alreadyVal;
                    treasuryDataArr[index].leftTime = data.leftTime;
                    break;
                }
            }
            // if(data.type == 0) {
            //     if(value.name == data.name && value.type == data.type) {
            //         treasuryDataArr[index].value = data.value;
            //         break;
            //     }
            // }else{
            //     if(value.name == data.name && value.type == data.type) {
            //         treasuryDataArr[index].value = data.value;
            //         treasuryDataArr[index].waitVal = data.waitVal;
            //         treasuryDataArr[index].alreadyVal = data.alreadyVal;
            //         treasuryDataArr[index].leftTime = data.leftTime;
            //         break;
            //     }
            // }
        }
        localStorage.treasuryData = JSON.stringify(treasuryDataArr);
    }
}

function updateTotal() {
    let availableCash = 0;
    let haveCash = 0;
    let liability = 0;
    let shouldReturned = 0;

    $('.assets-item .assets-val-2').each(function() {
        availableCash += toNumber($(this).html());
        haveCash += toNumber($(this).html());
    });

    $('.credit-item .credit-val-2').each(function() {
        availableCash += toNumber($(this).html());
    });

    $('.credit-item .wait-val-2').each(function() {
        liability += toNumber($(this).html());
    });

    $('.credit-item .already-val-2').each(function() {
        shouldReturned += toNumber($(this).html());
    });

    $('.available-cash p').html(`￥${toMoney(Math.round(availableCash))}`);
    $('.have-cash p').html(`￥${toMoney(Math.round(haveCash))}`);
    $('.liability p').html(`￥${toMoney(Math.round(liability))}`);
    $('.should-returned p').html(`￥${toMoney(Math.round(shouldReturned))}`);
}

// 转换标准金额格式
function toMoney(num){
    num = Number(num);
    num = num.toFixed(2);
    num = parseFloat(num)
    num = num.toLocaleString();
    return num;//返回的是字符串23,245.12保留2位小数
}

// 转换成普通数字格式
function toNumber(string){
    if(string == undefined) {
        return false;
    }
    
    string = string.replace(/￥|,/g, '');
    return Number(string);;
}

function clearIuput() {
    $('.item-ctn input').each(function(index, ele) {
        ele.value = '';
    })
}