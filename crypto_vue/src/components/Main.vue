<template>
  <div class="home">
    <div class="bx">
      <header>
        <h1>Live Cryptocurrency</h1>
        <p class="countdown">{{timer}}</p>
        <button type="button" class="btn_reload" v-on:click="refresh()">
          <span class="blind">Refresh</span>
        </button>
      </header>
      <h2 class="h_type">Live Prices <span><span></span>{{priceTime}}</span></h2>
      <table class="type09">
        <caption>Cryptocurrency Live</caption>
        <thead>
          <tr>
            <th><a :href="linkUrl.BTC">BTC/KRW</a></th>
            <th><a :href="linkUrl.ETH">ETH/KRW</a></th>
            <th><a :href="linkUrl.XRP">XRP/KRW</a></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td :class="fnActive(arrActive[0])"><a :href="linkUrl.BTC"><div>{{priceData[0]}}</div></a></td>
            <td :class="fnActive(arrActive[1])"><a :href="linkUrl.ETH"><div>{{priceData[1]}}</div></a></td>
            <td :class="fnActive(arrActive[2])"><a :href="linkUrl.XRP"><div>{{priceData[2]}}</div></a></td>
          </tr>
          <tr>
            <td :class="fnActive(arrActive[3])"><a :href="linkUrl.BTC"><div>{{priceData[3]}} %</div></a></td>
            <td :class="fnActive(arrActive[4])"><a :href="linkUrl.ETH"><div>{{priceData[4]}} %</div></a></td>
            <td :class="fnActive(arrActive[5])"><a :href="linkUrl.XRP"><div>{{priceData[5]}} %</div></a></td>
          </tr>
        </tbody>
      </table>
      <h2>Recent News <span><span></span>{{newsTime}}</span></h2>
      <ul>
        <li v-for="data in newsData" :key="data.id">
          <a :href="data.url">
            <div class="bx2">
              <img :src="data.imageurl" width="60" height="60" alt="">
            </div>
            <dl>
              <dt>{{data.title}}</dt>
              <dd>
                <p>{{data.body}}</p>
              </dd>
            </dl>
          </a>
        </li>
      </ul>
      <button type="button" class="btn_type" v-on:click="getData2()">More ({{cntNews}}/{{totalNews}})</button>
    </div>
    <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
  </div>
</template>

<script>
export default {
  name: 'Main',
  props: {
    testmsg: String
  },
  data(){
    const baseURL = 'https://cryptowat.ch/markets/bithumb'
    let init = 60
    return {
      priceData:[],
      newsData:[],
      timer:init,
      initTimer:init,
      prevData:[],
      arrActive:[],
      priceTime:'',
      newsTime:'',
      initNews:10,
      cntNews:'',
      totalNews:'',
      start: true,
      timeinit : 60,
      linkUrl: {
				BTC : baseURL + 'btc/krw',
				ETH : baseURL + 'eth/krw',
				XRP : baseURL + 'xrp/krw'
      },
      isLoading: false,
      fullPage: true
    }
  },
  created() {
		this.getData();
    this.getData2();
    this.priceTime = this.currentDate();
    this.newsTime = this.currentDate();
  },
  methods: {
    // get Price data
    getData() {
      const baseApiURL = 'https://min-api.cryptocompare.com/data'
      let url = baseApiURL+'/pricemultifull?fsyms=BTC,ETH,XRP&tsyms=KRW&api_key=b1e0e632fb30692d72f286708fe1fe365914c6528678c6f38e1b80633bdaac3e';
      this.$http.get(url)
      .then((r) => {
        this.isLoading = true;
        this.prevData = this.priceData;
        this.priceData = [
          r.data.DISPLAY.BTC.KRW.PRICE,
          r.data.DISPLAY.ETH.KRW.PRICE,
          r.data.DISPLAY.XRP.KRW.PRICE,
          r.data.DISPLAY.BTC.KRW.CHANGEPCT24HOUR,
          r.data.DISPLAY.ETH.KRW.CHANGEPCT24HOUR,
          r.data.DISPLAY.XRP.KRW.CHANGEPCT24HOUR
        ]
        setTimeout(() => {
          this.isLoading = false
        },500)
        // compare prevdata = thisdata
        this.prevData.reduce((res, d, i) => {
          if(this.priceData[i] == d){
            // same = true (add class)
            this.isActive = true
          }else{
            this.isActive = false
          }
          // isActive 값을 array에 담음
          res.push(this.isActive);
          this.arrActive = res;
          return res;
        }, [])
        // timer check
        let t = setInterval(() => {
          if (this.timer !== 0){
            this.timer--;
          }else {
            clearInterval(t)
            this.timer = this.initTimer
            this.getData();
            this.msg('Update checked!')
          }
        }, 1000);
      });
    },
    // get News data
    getData2() {
      const baseApiURL = 'https://min-api.cryptocompare.com/data'
      let url = baseApiURL+'/v2/news/?lang=EN';
      this.$http.get(url)
      .then((r) => {
        this.totalNews = r.data.Data.length;
        this.isLoading = true;
        if(this.cntNews == ''){
          this.cntNews = this.initNews;
        }else{
          if(this.cntNews == this.totalNews){
            this.msg('List items are fully loaded!')
          }else{
            this.cntNews = this.cntNews + this.initNews;
          }
          setTimeout(() => {
            this.isLoading = false
          },500)
        }
        // 세팅된 cntNews 만큼 array에 담음
        let datas = [];
        for(let i=0;i<this.cntNews;i++){
          let data = r.data.Data[i];
          datas.push(data)
        }
        this.newsData = datas
      })
    },
    refresh() {
			location.reload();
    },
    currentDate() {
      return this.$moment(new Date()).format('HH:mm')
    },
    fnActive(arg) {
      if(arg == false){
        this.priceTime = this.currentDate();
        return 'active';
      }else{
        return '';
      }
    },
    // Toast popup
		msg(dsc) {
			this.$toasted.success(dsc, {
				theme: 'toasted-primary',
				position: 'top-left',
				duration: 2000,
				containerClass: 'toast-custom'
			});
    }
  }
}
</script>