<template>
  <div id="app">
    <div v-if="!isConnect">
      <b-jumbotron header="Ethereum Temple" lead="ETHをお布施して貴方の願いを叶えましょう" >
        <p>Ropstenテストネットワークで動作しています</p>
        <b-btn variant="primary" @click="connect">Connect</b-btn>
      </b-jumbotron>
      <h4>参拝方法</h4>
      <p>1. connectを押してuport経由でログインします</p>
      <p>2. Etherと願い事を入力し、参拝します</p>
      <p>3. uportアプリに送信するトランザクションの情報が届くので、許可をします</p>
      <p>4. しばらくすると、uportに神様からの声が届きます</p>

      <p style="margin-top:40px">お問い合わせは<a href="https://github.com/1234224576/ETHTemple">https://github.com/1234224576/ETHTemple</a>まで。</p>
    </div>

    <div v-if="isConnect">
      <b-jumbotron>
        <template slot="header">
          <img src='./assets/ethereum-1.svg' width='256' height='256' style="margin-bottom:20px">
        </template>
        <template slot="lead">
          ようこそ。<br />貴方の願いはもうすぐ叶います。さあ、そこにETHを入れて下さい。
        </template>
        
        <p>これまでのお布施 合計 {{ total }}eth</p>
      </b-jumbotron>

      <p>0.1 ether以上のお布施をお願いします</p>
      <p><input type="number" v-model.number="eth" />ether</p>
      <p><input type="text" style="width:400px" v-model="message" maxlength=40 placeholder="願い事を入力してください" /></p>
      <b-button @click="submit" v-bind:disabled="wait || waitApp">参拝</b-button>

      <b-alert show v-if="waitApp">uportアプリからトランザクションを確認して下さい...</b-alert>
      <b-alert show v-if="wait">トランザクションが取り込まれるのを待っています...</b-alert>
      <b-alert show v-if="succsess" variant="success">uportアプリに神の声が届きました.ご確認下さい</b-alert>
      <b-alert variant="danger"
            dismissible
            :show="error!=''"
            @dismissed="error==''"
            style="display:block;width:800px;margin-top:30px;margin-left:auto;margin-right:auto;"
      >
        {{ error }}
      </b-alert>
      
    </div>
  </div>
</template>

<script>
import { web3, uport } from './uportSetup'
import ETHTempleContract from './ETHTempleContract'
import waitForMined from './waitForMined'

export default {
  mounted(){
    ETHTempleContract.getTotal.call((error, total) => {
      if(error != undefined){
        this.$data.error = error.toString();
        return;
      }
      this.$data.total = parseFloat(web3.fromWei(total, 'ether'));
    });
  },
  methods: {
    connect(){
      uport.requestCredentials({
        requested: ['name', 'country', 'avatar'],
        notifications: true 
      }).then((credentials) => {
        console.log({credentials})
        this.$data.isConnect = true;
      })
    },
    submit(){
      this.$data.error = "";
      this.$data.succsess = false;
      this.$data.waitApp = true;
      ETHTempleContract.worship({value: web3.toWei(this.$data.eth, 'ether')}, (error, txHash) =>{
        this.$data.waitApp = false;
        this.$data.wait = true;

        if(error != undefined){
          this.$data.error = error.toString()
          this.$data.waitApp = false;
          this.$data.wait = false;
          return;
        }

        waitForMined(txHash,{ blockNumber: null },() => {
          this.$data.wait = true;
        },
        (response) => {

          web3.eth.getTransactionReceipt(txHash, function(error, result){
            if(error != undefined || result.status == '0x0') {
              this.$data.error = "トランザクションの取り込みにエラーが発生しました。所持etherが足りているかご確認下さい。txHash:" + txHash;
              this.$data.waitApp = false;
              this.$data.wait = false;
              return;
            }

            this.$data.succsess = true;
            this.$data.wait = false;

            let prob = 0;
            if(this.$data.eth >= 0.1) {
              prob = 0.2;
            }
            if(this.$data.eth >= 0.5) {
              prob = 0.5;
            }
            if(this.$data.eth >= 1.0) {
              prob = 0.8;
            }
            if(prob > Math.random()){
              uport.attestCredentials({
                sub: uport.address,
                claim: {Result: "「" + this.$data.message + "」は叶うでしょう"},
                exp: new Date().getTime() + 1800 * 1000 //30 minuites from now,
              })
            } else {
              uport.attestCredentials({
                sub: uport.address,
                claim: {Result: "「" + this.$data.message + "」を叶えるには更なるお布施が必要です"},
                exp: new Date().getTime() + 1800 * 1000 //30 minuites from now,
              })
            }
          }.bind(this))
        })
      })
    }
  },
  data () {
    return {
      isConnect: false,
      total: 0,
      eth: 0,
      message: "",
      waitApp: false,
      wait: false,
      succsess: false,
      error: ""
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

</style>
