$(() => {
    if(localStorage.treasuryData) {
        let treasuryDataArr = JSON.parse(localStorage.treasuryData);
        for(let data of treasuryDataArr) {
            if(data.type == 0) {
                $('.assets').append(`
                    <div class="assets-item">
                        <input type="text" class="assets-name-2" value=${data.name}>
                        <input type="number" class="assets-val-2" value=${data.value}>
                        <i class="far fa-trash-alt" onclick="deleteRow(this)"></i>
                    </div>
                `);
            }else{
                $('.credit').append(`
                    <div class="credit-item">
                        <input type="text" class="credit-name-2" value=${data.name}>
                        <input type="number" class="credit-val-2" value=${data.value}>
                        <input type="number" class="wait-val-2" value=${data.waitVal}>
                        <input type="number" class="already-val-2" value=${data.alreadyVal}>
                        <input type="number" class="left-time-2" value=${data.leftTime}>
                        <i class="far fa-trash-alt" onclick="deleteRow(this)"></i>
                    </div>
                `);
            }
        }
        updateTotal();
    }
})

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
    $('.assets').append(`
        <div class="assets-item">
            <input type="text" class="assets-name-2" value=${$('.assets-name').val()}>
            <input type="number" class="assets-val-2" value=${$('.assets-val').val()}>
            <i class="far fa-trash-alt" onclick="deleteRow(this)"></i>
        </div>
    `);

    $('.new-chart').fadeOut();
    updateTotal();

    updateStorage('add', {
        type: 0, // 0资产类 1信用卡类
        name: $('.assets-name').val(), // 名称
        value: $('.assets-val').val() // 余额 / 额度
    })
}

function addCredit() {
    $('.credit').append(`
        <div class="credit-item">
            <input type="text" class="credit-name-2" value=${$('.credit-name').val()}>
            <input type="number" class="credit-val-2" value=${$('.credit-val').val()}>
            <input type="number" class="wait-val-2" value=${$('.wait-val').val()}>
            <input type="number" class="already-val-2" value=${$('.already-val').val()}>
            <input type="number" class="left-time-2" value=${$('.left-time').val()}>
            <i class="far fa-trash-alt" onclick="deleteRow(this)"></i>
        </div>
    `);

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
    console.log(data)
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
        availableCash += Number($(this).val());
        haveCash += Number($(this).val());
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

    $('.available-cash p').html(availableCash);
    $('.have-cash p').html(haveCash);
    $('.liability p').html(liability);
    $('.should-returned p').html(shouldReturned);
}