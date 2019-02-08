$(() => {
    if(localStorage.treasuryData) {
        let treasuryDataArr = JSON.parse(localStorage.treasuryData);
        for(let data of treasuryDataArr) {
            if(data.type == 0) {
                appendAssetsItem(data.name, data.value)
            }else{
                appendCreditItem(data.name, data.value, data.waitVal, data.alreadyVal, data.leftTime)
            }
        }
        updateTotal();
    }
});

function appendAssetsItem(name, value) {
    $('.assets').append(`
        <div class="assets-item">
            <span class="assets-name-2">${name}</span>
            <span class="assets-val-2">￥${toMoney(value)}</span>
        </div>
    `);
}

function appendCreditItem(name, value, waitVal, alreadyVal, leftTime) {
    $('.credit').append(`
        <div class="credit-item">
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
                <span class="already-val-2 val-2">${leftTime}</span>
            </p>
        </div>
    `);
}

$('.confirm-chart').click(addAssets);
$('#trueMoney').change(function() {
    $('.item-ctn').remove();
    $('.chart-ctn').prepend(`
        <div class="item-ctn">
            <input type="text" placeholder="NAME" class="assets-name">
            <input type="text" placeholder="额度/剩余额度" class="assets-val">
        </div>
    `);

    $('.confirm-chart').unbind();
    $('.confirm-chart').click(addAssets);
});
$('#creditMoney').change(function() {
    $('.item-ctn').remove();
    $('.chart-ctn').prepend(`
        <div class="item-ctn">
            <input type="text" placeholder="NAME" class="credit-name">
            <input type="text" placeholder="额度/剩余额度" class="credit-val">
            <input type="text" placeholder="待还金额" class="wait-val">
            <input type="text" placeholder="出帐待还" class="already-val">
            <input type="text" placeholder="剩余期数" class="left-time">
        </div>
    `);
    $('.confirm-chart').unbind();
    $('.confirm-chart').click(addCredit);
});

function addAssets() {
    appendAssetsItem($('.assets-name').val(), $('.assets-val').val())

    $('.new-chart').fadeOut();
    updateTotal();

    updateStorage('add', {
        type: 0, // 0资产类 1信用卡类
        name: $('.assets-name').val(), // 名称
        value: $('.assets-val').val() // 余额 / 额度
    })
}

function addCredit() {
    appendCreditItem($('.credit-name').val(), $('.credit-val').val(), $('.wait-val').val(), $('.already-val').val(), $('.left-time').val())

    $('.new-chart').fadeOut();
    updateTotal();

    updateStorage('add', {
        type: 1, // 0资产类 1信用卡类
        name: $('.credit-name').val(), // 名称
        value: $('.credit-val').val(), // 余额 / 额度
        waitVal: $('.wait-val').val(), // 待还
        alreadyVal: $('.already-val').val(), // 已出账
        leftTime: $('.left-time').val() // 剩余期数
    })
}

function deleteRow(thisRow) {
    $(thisRow).parents('.assets-item').remove();
    $(thisRow).parents('.credit-item').remove();

    updateTotal();

    updateStorage('delete', {
        type: $(thisRow).parents('.assets-item').length == 1 ? 0 : 1, // 0资产类 1信用卡类
        name: $(thisRow).prevAll('.assets-name-2').val() || $(thisRow).prevAll('.credit-name-2').val(), // 名称
        value: toNumber($(thisRow).prevAll('.assets-val-2').html()) || toNumber($(thisRow).prevAll('.credit-val-2').html()), // 余额 / 额度
        waitVal: toNumber($(thisRow).prevAll('.wait-val-2').html()), // 待还
        alreadyVal: toNumber($(thisRow).prevAll('.already-val-2').html()), // 已出账
        leftTime: $(thisRow).prevAll('.left-time-2').html() // 剩余期数
    })
}

//status add增加 delete删除; data 数据
/*
data = {
    type: 0, // 0资产类 1信用卡类
    name: '', // 名称
    value: 0, // 余额 / 额度
    waitVal: 0, // 待还
    alreadyVal: 0, // 已出账
    leftTime: 0 // 剩余期数
}
*/
function updateStorage(status, data) {
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
            if(data.type == 0) {
                if(value.name == data.name && value.type == data.type && value.value == data.value) {
                    treasuryDataArr.splice(index, 1);
                    break;
                }
            }else{
                if(value.name == data.name && value.type == data.type && value.value == data.value && value.waitVal == data.waitVal && value.alreadyVal == data.alreadyVal && value.leftTime == data.leftTime) {
                    treasuryDataArr.splice(index, 1);
                    break;
                }
            }
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

    $('.available-cash p').html(`￥${toMoney(availableCash)}`);
    $('.have-cash p').html(`￥${toMoney(haveCash)}`);
    $('.liability p').html(`￥${toMoney(liability)}`);
    $('.should-returned p').html(`￥${toMoney(shouldReturned)}`);
}

let longClick = 0;
let timeOutEvent = '';
$(".assets-item").on({
    touchstart: function(){
        longClick = 0;//设置初始为0
        timeOutEvent = setTimeout(function() {
            longClick = 1;//假如长按，则设置为1
        }, 500);
    },
    touchmove: function(){
        clearTimeout(timeOutEvent);
        timeOutEvent = 0;
        // e.preventDefault();
    },
    touchend: function(){
        clearTimeout(timeOutEvent);
        if(longClick == 0){
            console.log(6868)
        }
        return false;
    }
});


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
    string = string.replace(/￥|,/g, '');
    return Number(string);;
}