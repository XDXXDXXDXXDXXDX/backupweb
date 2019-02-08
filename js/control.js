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
            <p>
                <span>${name}</span>
                <span class="assets-val-2">￥${toMoney(value)}</span>
            </p>
        </div>
    `);
}

function appendCreditItem(name, value, waitVal, alreadyVal, leftTime) {
    $('.credit').append(`
        <div class="credit-item">
            <input type="text" class="credit-name-2" value=${name}>
            <input type="number" class="credit-val-2" value=${value}>
            <input type="number" class="wait-val-2" value=${waitVal}>
            <input type="number" class="already-val-2" value=${alreadyVal}>
            <input type="number" class="left-time-2" value=${leftTime}>
        </div>
    `);
}

$('#item-choose').change(function() {
    $('.item-ctn').remove();
    if($('#item-choose').val() == 0) {
        $('.chart-ctn').prepend(`
            <div class="item-ctn">
                <p>资产名</p>
                <input type="text" placeholder="微信、支付宝等" class="assets-name">
                <p>余额</p>
                <input type="text" placeholder="88888888" class="assets-val">
            </div>
        `);

        $('.confirm-chart').unbind();
        $('.confirm-chart').click(addAssets);
    }else if($('#item-choose').val() == 1){
        $('.chart-ctn').prepend(`
            <div class="item-ctn">
                <p>信用名</p>
                <input type="text" placeholder="花呗，、白条等" class="credit-name">
                <p>剩余额度</p>
                <input type="text" placeholder="88888888" class="credit-val">
                <p>待还</p>
                <input type="text" placeholder="666666" class="wait-val">
                <p>已出账</p>
                <input type="text" placeholder="233" class="already-val">
                <p>剩余期数</p>
                <input type="text" placeholder="12" class="left-time">
            </div>
        `);
        $('.confirm-chart').unbind();
        $('.confirm-chart').click(addCredit);
    }
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
        value: $(thisRow).prevAll('.assets-val-2').val() || $(thisRow).prevAll('.credit-val-2').val(), // 余额 / 额度
        waitVal: $(thisRow).prevAll('.wait-val-2').val(), // 待还
        alreadyVal: $(thisRow).prevAll('.already-val-2').val(), // 已出账
        leftTime: $(thisRow).prevAll('.left-time-2').val() // 剩余期数
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
        availableCash += Number($(this).val());
    });

    $('.credit-item .wait-val-2').each(function() {
        liability += Number($(this).val());
    });

    $('.credit-item .already-val-2').each(function() {
        shouldReturned += Number($(this).val());
    });

    $('.available-cash p').html(`￥${toMoney(availableCash)}`);
    $('.have-cash p').html(`￥${toMoney(haveCash)}`);
    $('.liability p').html(`￥${toMoney(liability)}`);
    $('.should-returned p').html(`￥${toMoney(shouldReturned)}`);
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
    string = string.replace(/￥|,/g, '');
    return Number(string);;
}