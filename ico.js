
const key = 'icoShowBox' + Date.now().toString(36)
const innerSvg = (svg) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iconfont 预览</title>
  <style type="text/css">
  .icon-list{clear:both;overflow:hidden;margin:40px auto;padding:0;width:1160px;color:#666;list-style:none;font-size:36px;}
  .icon-list li{position:relative;float:left;overflow:visible;margin:15px 13px;width:100px;height:105px;border:1px solid #e0e0e0;border-radius:5px;text-align:center;cursor:pointer;transition:all .4s;user-select:none;}
  .icon-list li:hover{box-shadow:1px 2px 10px #ddd;}
  .icon-list .wrap{display:inline-block;margin-top:18px;}
  .icon-list .icon{overflow:hidden;width:1em;height:1em;vertical-align:middle;font-size:inherit;fill:currentColor;}
  .icon-list .name{display:block;overflow:hidden;margin-top:15px;padding:0 .5em;height:20px;color:#666;text-align:center;text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:1.2;}
  .toast{position:fixed;top:16px;right:32px;padding:6px 1.2em;border-radius:4px;background-color:#48c774;color:#fff;font-size:14px;opacity:0;transition:opacity .4s;}
  </style>
</head>
<body>
${svg.outerHTML}
  <script id="tpl-item" type="text/template">
    <div class="wrap">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#@name"></use>
      </svg>
    </div>
    <span class="name">@name</span>
  </script>
  <div class="toast"></div>
  <ul class="icon-list"></ul>
  <script>
    function toast(msg, ms) {
      const node = document.querySelector('.toast');
      node.innerHTML = msg;
      node.style.opacity = 1;
      clearTimeout(toast.intervalId || 0);
      toast.intervalId = setTimeout(() => {
        node.style.opacity = 0;
      }, ms || 2000);
    }
    function copyText(text) {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      toast('复制成功');
    }
    document.addEventListener('DOMContentLoaded', () => {
      const iconList = document.querySelector('.icon-list');
      const tpl = document.querySelector('#tpl-item').innerHTML;
      [...document.querySelectorAll('svg > symbol')].forEach(icon => {
        const li = document.createElement('li');
        li.innerHTML = tpl.replace(/@name/g, icon.id);
        li.onclick = () => copyText(icon.id);
        iconList.appendChild(li);
      });
    }, false);
  </script>
</body>
</html>`;

const getIcon = (name) => `
<svg class="icons" aria-hidden="true">
  <use xlink:href="#${name}"></use>
</svg>
`;

//样式
const createStyle = () => `
.${key} {width:44px;height:44px;margin:0 auto;position:fixed;right:10px;bottom:10px;z-index:99;background: #fff;border-radius:8px;padding:14px;overflow: hidden;box-shadow: rgb(0 0 0 / 15%) 0px 0px 6px 4px;}
.${key}.cur {width: 250px; height: auto;}
.${key} .icoItemTitle {font-size: 12px;color:#000;margin-bottom:10px;display:flex;justify-content:space-between;}
.${key} .icoItemTitle .icoItemText {display:none;}
.${key}.cur .icoItemTitle .icoItemText {display:block;}
.${key} .icoItemTitle .icoItemOption {cursor: pointer;color:#1890ff;}
.${key} .icoItemTitle .icoItemOption .icons{overflow:hidden;width:14px;height:14px;vertical-align:middle;font-size:inherit;fill:currentColor;margin-right:5px}
.${key} .icoItem {font-size: 12px;color:#666;margin-bottom:5px;display:flex;justify-content:space-between;}
.${key} .icoItem .icons {overflow:hidden;width:12px;height:12px;vertical-align:middle;font-size:inherit;fill:currentColor;margin-right:5px}
.${key} .icoItem .icoItemIndex {width:20px;display: inline-block;}
.${key} .icoItem .icoItemProportion {color:#52c41a;}
.${key} .icoItem-${key} {cursor: pointer;color:#1890ff;}
`;

//添加样式
function addStyle(){
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = createStyle();
    window.document.head.appendChild(style);
}

//添加数据显示区域
function showIco(d){
    let div = document.createElement("div");
    div.className = key;
    div.id = key;
    window.document.body.appendChild(div);
}

//获取子数组之间重复率
function getSome(arr){
  let innerHtml = `
      <div class="icoItemTitle">
        <span class="icoItemText">ICO信息</span>
        <span class="icoItemOption">&#9752</span/>
      </div>
    `;
  let newArr = [], otherArr = [], allArr = []
  for(j = 0,len=arr.length; j < len; j++) {
    if(j > arr.length) return;
    let SamePart=arr[0].icos.filter(item=> arr[j]?.icos.includes(item))
    console.log(SamePart.length, 'SamePart.length')
    if((SamePart.length / arr[j]?.icos.length)*100 > 50){
      newArr.push({id: arr[j].id, type: arr[j].type, v: (SamePart.length / arr[j].icos.length)*100, icos: arr[j].icos})
    }else{
      otherArr.push({id: arr[j].id, type: arr[j].type, v: (SamePart.length / arr[j].icos.length)*100, icos: arr[j].icos})
    }
  }
  allArr = newArr.concat(otherArr)
  console.log('allArr', allArr)
  allArr.map((item, index) => {
    innerHtml += `
      <div class="icoItem">
        <span>
          <span class="icoItemIndex">(${index > 0 ? item.id : '主'})</span>
          ${getIcon('iconrobot')} ${item.type}：${item?.icos.length}个
          <span class="icoItemProportion">${(item?.v).toFixed(2) || 0}%</span>
        </span>
        <span data-id="${item.id}" class="icoItem-${key}" >&#10174;</span>
      </div>`;
  });
  return innerHtml
}

//处理SVG数据
function iconShow(dom){
  let icoDatas = []; //SVG数据
  dom.forEach((element, index) => {
    if(element.dataset.id){
        //带版本号SVG
        let icos = [];
        element.childNodes.forEach(e => {
            icos.push(e.id);
        });
        icoDatas.push({id: parseInt(index + 1), type: 'V-ICOS', icos});
    }else{
        //不带版本号
        let icos = [];
        element.childNodes.forEach(e => {
            icos.push(e.id);
        });
        icoDatas.push({id: parseInt(index + 1), type: 'ICOS', icos });
    };
  });
  if(icoDatas.length > 0){
    let arr = icoDatas.sort((a,b) => b.icos.length-a.icos.length)
    setTimeout(() => {
      window.document.getElementById(key).innerHTML = getSome(arr);
    }, 1000);
  };
}

setTimeout(() => {
    const svgs = document.querySelectorAll('body>svg');
    console.log(svgs.length);
    if(svgs.length > 2){
        addStyle();
        showIco();
        iconShow(svgs);
        document.getElementById(key).addEventListener("click", (e) => {
            const node = e.target;
            if(node.dataset.id){
              //查看详情
              const win = window.open();
              const chKey = node.dataset.id;
              win.document.write(innerSvg(svgs[chKey]));
              win.document.close();
            }else{
              if(node.hasChildNodes('icoItemOption')){
                //展开 / 收起
                const ch = document.getElementById(key).clientHeight;
                if( ch < 80){
                  document.getElementById(key).classList.add('cur');
                }else{
                  document.getElementById(key).classList.remove('cur');
                }
              }
            }
            
        })
    }
}, 5000)
