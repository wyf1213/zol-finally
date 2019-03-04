requirejs.config({
    baseUrl:"./js",
    urlArgs:"va="+(new Date()).getTime(),
    paths:{
        "jquery" : ["./lib/jquery-1.11.1.min"],
        "jquery.cookie":["./lib/jquery.cookie"],
        "showUname":["./showUname"],
        "cartNums":["./cartNums"],
    }
})
requirejs(["jquery","jquery.cookie","showUname","cartNums"],function($,a,b,c){
    $(function () {
        b.show();
        c.getNum();
        ////////////动态加载数据 ////////////
        var oIsLogin = JSON.parse(sessionStorage.getItem("login"));
        if(oIsLogin!=null){
            var oId =oIsLogin.uid;
            $.ajax({
                url:"./../server/cartList.php",
                type:"post",
                dataType:"json",
                data:{"uId":oId}
            }).then(function (res) {
                if(res.cartnum>0){
                    res.data.forEach((el,index)=>{
                        var strHtml = `
                        <tr data-info='${JSON.stringify(el)}'>
                            <td colspan="2" class="s-infor clear">
                                <input type="checkbox">
                                <a href="details.html?gId=${el.gId}" class="pic">
                                    <img src="${el.gImg}" alt="">
                                </a>
                                <div class="inforbox">
                                    <h3 class="tit">
                                        <a href="details.html?gId=${el.gId}">${el.gName}</a>
                                    </h3>
                                    <p>内存：${el.gMemory}</p>
                                    <p>颜色：${el.gColor}</p>
                                    <div class="info-con">
                                        <span>套装：${el.gSuit}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="s-price ">
                                <em>${el.gPrice}</em>
                            </td>
                            <td class="s-amount">
                                <div class="buy-num">
                                    <a class="minus" href="#" title="减一">-</a>
                                    <input type="text" autocomplete="off" class="text-amount" value="${el.gNum}">
                                    <a class="plus" href="#" title="加一">+</a>
                                </div>
                            </td>
                            <td class="s-agio">
                                <div>&minus;&minus;</div>
                            </td>
                            <td class="s-total">
                                <em>${el.gTotal}</em>
                            </td>
                            <td class="s-del">
                                <div class="s-delbox"> 
                                    <a href="javascript:void(0)">删除</a>
                                    <div class="deletebox">
                                        <p>确认要删除该商品吗？</p>
                                        <a href="#" id="yesDelete">是的</a>
                                        <a href="#" id="noDelete">取消</a> 
                                        <i></i>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        `;
                        $("#tab").append(strHtml);
                    });
                }else {
                    $(".cart").html("<p style='text-align: center;height: 200px;line-height: 200px'>" +
                        "您还没有加购任何商品哦!赶紧<a href='index.html'>购物</a>去吧！</p>");
                }
            });
        } else {
            //用户没有登录时
            //读取cookie中的数据
            let cookieList = JSON.parse($.cookie("cartInfo")||'[]');
            console.log(cookieList);
            if(cookieList.length>0){
                cookieList.forEach((el,index)=>{
                    var strHtml = `
                    <tr data-info='${JSON.stringify(el)}'>
                        <td colspan="2" class="s-infor clear">
                            <input type="checkbox" id="cbbox">
                            <a href="details.html?gId=${el.gId}" class="pic">
                                <img src="${el.gImg}" alt="">
                            </a>
                            <div class="inforbox">
                                <h3 class="tit">
                                    <a href="details.html?gId=${el.gId}">${el.gName}</a>
                                </h3>
                                <p>内存：${el.gMemory}</p>
                                <p>颜色：${el.gColor}</p>
                                <div class="info-con">
                                    <span>套装：${el.gSuit}</span>
                                </div>
                            </div>
                        </td>
                        <td class="s-price ">
                            <em>${el.gPrice}</em>
                        </td>
                        <td class="s-amount">
                            <div class="buy-num">
                                <a class="minus" href="#" title="减一">-</a>
                                <input type="text" autocomplete="off" class="text-amount" value="${el.gNum}">
                                <a class="plus" href="#" title="加一">+</a>
                            </div>
                        </td>
                        <td class="s-agio">
                            <div>&minus;&minus;</div>
                        </td>
                        <td class="s-total">
                            <em>${el.gPrice*el.gNum}</em>
                        </td>
                        <td class="s-del">
                            <div class="s-delbox"> 
                                <a href="javascript:void(0)">删除</a>
                                <div class="deletebox">
                                    <p>确认要删除该商品吗？</p>
                                    <a href="#" id="yesDelete">是的</a>
                                    <a href="#" id="noDelete">取消</a> 
                                    <i></i>
                                </div>
                            </div>
                        </td>
                    </tr>
                    `;
                    $("#tab").append(strHtml);
                });


            }else {
                $(".cart").html("<p style='text-align: center;height: 200px;line-height: 200px'>" +
                    "您还没有加购任何商品哦!赶紧<a href='index.html'>购物</a>去吧！</p>");
            }
            // alert("请先登录");
            // location="login.html";
        }


        function goodsTotal() {
            /////////商品总价/////////
            //console.log($("tbody tr .s-infor input:checked"));
            if($("tbody tr .s-infor input:checked").length>0){
                var oTd = $("tbody tr .s-infor input:checked").parents("td");
                var numList = [];
                oTd.each((index,el)=>{
                    var oNum = parseInt($(el).siblings("td").eq(3).children("em").text());
                    numList.push(oNum);
                })
                //console.log(numList);
                if(numList.length>0){
                    var osumMoeny = numList.reduce(function(pre, cur){
                        return pre + cur;
                    });
                }
                $(".total-cart-price").text(osumMoeny);
            }else {
                $(".total-cart-price").text(0);
            }

        }
        goodsTotal();

        //////////////更改数量//////////////
        //减
        $("body").on("click","#tab .minus",function () {
            if($(this).siblings(".text-amount").val()>1){
                var index = $(this).parents("tr").index();
                //表面上减少值
                console.log(parseInt($(this).siblings("input").val()));
                $(this).siblings(".text-amount").val(parseInt($(this).siblings("input").val())-1);

                //表面上更改总价
                var oPrice = parseInt($(this).parents("td").siblings("td").eq(1).text().trim());
                var oNum = parseInt($(this).siblings("input").val());
                $(this).parents("td").siblings("td").eq(3).children("em").text(oPrice*oNum);
                //拿到当前的data值
                var currentData = JSON.parse($(this).parents("tr").attr("data-info"));
                currentData.gNum=-1;
                goodsTotal();
                if(oIsLogin!=null){
                    updateData(currentData);
                }else {
                    cookieUpdate(index,currentData);
                }
            }
            return false;
        });
        // //加
        $("body").on("click","#tab .plus",function () {
            var index = $(this).parents("tr").index();
            //表面上增加值
            $(this).siblings("input").val(parseInt($(this).siblings("input").val())+1);
            //表面上更改总价
            var oPrice = parseInt($(this).parents("td").siblings("td").eq(1).text().trim());
            var oNum = parseInt($(this).siblings("input").val());
            $(this).parents("td").siblings("td").eq(3).children("em").text(oPrice*oNum);
            var currentData = JSON.parse($(this).parents("tr").attr("data-info"));
            currentData.gNum=1;
            goodsTotal();
            if(oIsLogin!=null){
                updateData(currentData);
            }else {
                cookieUpdate(index,currentData);
            }
            return false;
        });
        function updateData(currentData) {
            $.ajax({
                url:"./../server/cart.php",
                type:"post",
                dataType:"json",
                data:currentData,
            }).then(function (res) {
                console.log("修改成功");
            });
        }
        function cookieUpdate(index,currentData){
            //拿到cookie
            const cookieInfo = JSON.parse($.cookie("cartInfo")||'[]');
            cookieInfo[index].gNum = parseInt(cookieInfo[index].gNum)+currentData.gNum;
            $.cookie("cartInfo",JSON.stringify(cookieInfo),{expires:7});
        }


        /////////////选择商品选中checkbox和不选中checkbox///////////////
        $("body").on("change","tbody tr .s-infor input",function () {
            goodsTotal();
            ///////////判断下面的复选框有没有全选//////////
            let allLength = $("tbody tr").length;
            let cbkLength= $("tbody tr .s-infor input:checked").length;
            $("#allCbk").prop("checked",allLength==cbkLength);
            return false;
        });

        //////////////删除////////////////
        //点击删除，弹出删除框
        $("body").on("click",".s-delbox a",function () {
            var $index = $(this).index();
            // console.log($self.parents("tr").children("td.s-infor #cbbox"));
            $(this).siblings(".deletebox").show();
            $(".order-table").on("click","#yesDelete",function () {
                $(this).parents(".deletebox").hide();
                c.getNum();
                //拿到所删除的那行的cId
                var curData = JSON.parse($(this).parents("tr").attr("data-info"));

                var totalMo = 0;
                $(".order-table tbody tr .s-infor input").each((index,el)=>{
                    if($(el).eq($index).prop("checked")){
                        var delData = parseInt($(el).parents("tr").children("td.s-total").text().trim());
                        totalMo += delData;
                    }
                });
                var tot = parseInt($(".total-price .total-cart-price").text().trim());
                var result = tot-totalMo;
                $(".total-cart-price").text(result);
                // if($(this).parents("tr").children("td.s-infor input").prop("checked")){
                //     var del = parseInt($(this).parents("tr").children("td.s-total").text().trim());
                //     var tot = parseInt($(".total-price .total-cart-price").text().trim());
                //     var result = tot-del;
                //     $(".total-cart-price").text(result);
                // }
                if(oIsLogin!=null){
                    $.ajax({
                        url:"./../server/deleteCart.php",
                        type:"post",
                        data:{"cId":curData.cId},
                        dataType:"json",
                    }).then(function (res) {
                        if(res.status==1){
                            //表面上删除那行
                            // goodsTotal();
                            $(this).parents("tr").remove();
                            console.log($("tbody tr .s-infor input:checked"));
                        }
                    });
                    $(this).parents("tr").remove();
                    c.getNum();
                    isNull();
                }else {
                    var index = $(this).parents("tr").index();
                    const cookieInfo = JSON.parse($.cookie("cartInfo")||'[]');
                    cookieInfo.splice(index,1);
                    $(this).parents("tr").remove();
                    $.cookie("cartInfo",JSON.stringify(cookieInfo),{expires:7});
                    c.getNum();
                    isNull();
                }
                return false;
            });
            $(".order-table").on("click","#noDelete",function (){
                $(this).parents(".deletebox").hide();
                return false;
            })
            return false;
        });

        function isNull(){
            if($("tbody tr .s-infor input").length==0){
                //$("#allCbk").prop("checked",false);
                $(".total-cart-price").text(0);
                $(".cart").html("<p style='text-align: center;height: 200px;line-height: 200px'>" +
                    "您还没有加购任何商品哦!赶紧<a href='index.html'>购物</a>去吧！</p>");
            }
        }
        //////////////////批量删除/////////////////
        $(".order-foot #volumeDelete").on("click",function () {
            var cbkLength = $("tbody tr .s-infor input:checked").length;
            if(cbkLength!=0){
                if(confirm("确定要删除所选择的商品吗？")){
                    if(oIsLogin!=null){
                        var dataInfoList = [];//存放选中的商品的购物车编号
                        //遍历所有的input看哪些被选中了，选中了就将编号放入数组中
                        var totalMo = 0;
                        $(".order-table tbody tr .s-infor input").each((index,el)=>{
                            if($(el).prop("checked")){
                                var dataInfo = JSON.parse($(el).parents("tr").attr("data-info"));
                                var dataId = dataInfo.cId;
                                var delData = parseInt($(el).parents("tr").children("td.s-total").text().trim());
                                totalMo += delData;
                                dataInfoList.push(dataId);
                                $(el).parents("tr").remove();
                            }
                        });
                        var tot = parseInt($(".total-price .total-cart-price").text().trim());
                        var result = tot-totalMo;
                        $(".total-cart-price").text(result);
                        console.log(dataInfoList);
                        //遍历数组中的购物车编号，根据编号删除
                        dataInfoList.forEach((el,index)=>{
                            $.ajax({
                                url:"./../server/deleteCart.php",
                                type:"post",
                                data:{"cId":el},
                                dataType:"json",
                            }).then(function (res) {
                                console.log(res);
                            });
                        });
                    }else {
                        const indexList = [];
                        const stot = [];
                        $(".order-table tbody tr .s-infor input").each((index,el)=>{
                            if($(el).prop("checked")){
                                indexList.push(index);
                                stot.push(parseInt($(el).parents("tr").children("td.s-total").text().trim()));
                            }
                            const cookieInfo = JSON.parse($.cookie("cartInfo")||'[]');
                            indexList.forEach((el,index)=>{
                                cookieInfo.splice(el,1);
                                $("#tab tr").eq(el).remove();
                            })
                            $.cookie("cartInfo",JSON.stringify(cookieInfo),{expires:7});
                        });
                        console.log(stot);
                        var resTotol = stot.reduce(function (pre,next) {
                            return pre+next;
                        });
                        console.log(resTotol);
                        var tot = parseInt($(".total-price .total-cart-price").text().trim());
                        var result = tot-resTotol;
                        $(".total-cart-price").text(result);

                    }
                    isNull();
                    c.getNum();
                }
            }else {
                alert("您没有选中任何商品");
            }
            return false;
        });

        ///////////////////全选//////////////////
        $("#allCbk").on("change",function () {
            let $self = $(this);
            $("tbody tr .s-infor input").each((index,el)=>{
                $(el).prop("checked",$self.prop("checked"));
            });
            goodsTotal();
            return false;
        });


    })
})


