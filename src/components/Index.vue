<template>
    <div id="eosdapp">
		<!-- 头号玩家合约安全规则说明路线图代码开源免责说明 -->
		<b-navbar toggleable="md" type="light" variant="light">
			<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
			<b-navbar-brand href="#">{{config.mainToken}}头号玩家</b-navbar-brand>
			<b-collapse is-nav id="nav_collapse">
				<b-navbar-nav>
					<b-nav-item v-bind:href="source" target="_blank_">合约开源</b-nav-item>
					 <b-nav-item v-bind:href="deskClientURL" target="_blank_">{{ deskClient }}</b-nav-item>
				</b-navbar-nav>
				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-nav-form>
						<b-form-input size="sm" class="mr-sm-2" type="text" v-model="ivtUrl" id="ivtUrl"/>
						<b-button size="sm" variant="outline-success" class="my-2 my-sm-0" @click.prevent="copyLink">复制邀请链接</b-button>
					</b-nav-form>
					<b-nav-item-dropdown v-bind:text="config.networkName" right>
						<b-dropdown-item @click.prevent="switchNet('eos')" v-bind:disabled="config.env === 'eos'">EOS主网</b-dropdown-item>
						<b-dropdown-item @click.prevent="switchNet('enu')" v-bind:disabled="config.env === 'enu'">ENU主网</b-dropdown-item>
						<b-dropdown-item @click.prevent="switchNet('dev')" v-bind:disabled="config.env === 'dev'">测试网</b-dropdown-item>
					</b-nav-item-dropdown>
					<b-nav-item-dropdown right>
						<!-- Using button-content slot -->
						<template slot="button-content">
							<b>{{ userName }}</b>
						</template>
						<b-dropdown-item @click.prevent="login">登陆</b-dropdown-item>
						<b-dropdown-item @click.prevent="logout">注销</b-dropdown-item>
						<b-dropdown-item @click.prevent="collect_fee">领取邀请奖励</b-dropdown-item>
						<b-dropdown-item @click.prevent="collect_reward">领取头号奖励</b-dropdown-item>
						<b-dropdown-item @click.prevent="unstake">取消头号抵押</b-dropdown-item>
					</b-nav-item-dropdown>
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>

		<div>
			<b-card overlay
					text-variant="white"
					title="绿洲，Oasis"
					sub-title="Thank you for playing my game."
					class="text-center">
				<p class="card-text">
				这是“绿洲”世界，在这里唯一限制你的是你自己的想象力。
				</p>
				
			</b-card>
			<div id="banner">
				<img src="../assets/img/key.jpg">
			</div>
		</div>
		<br>
		<div class="be-content">
			<div class="main-content container-fluid">
				<div class="row">
					<div class="col-12 col-lg-6 col-xl-6 in_raw">
						<el-card :body-style="{ padding: '10px' }" shadow="hover">
							<div slot="header" class="clearfix">
								<span>合约: {{this.config.gameContract}}</span>
							</div>
							{{config.gameToken}}发行量(200万):<el-progress :percentage="progress" color="#8e71c7"></el-progress>
							<!-- <el-progress :text-inside="true" :stroke-width="18" :percentage="progress"></el-progress> -->
							开始时间：{{ game.start_time > 0 ? new Date(game.start_time * 1000).toLocaleString():0 }}<br>
							Pool：{{pool + ' ' + config.mainToken}}<br>
							头号玩家：{{game.player_one}}<br>
							头玩奖励：{{game.reward}}<br>
							头玩抵押：{{game.staked}}<br>
							头玩奖励时间：{{ game.reward_time > 0 ? new Date(game.reward_time * 1000).toLocaleString():0 }}
						</el-card>
					</div>
					<div class="col-12 col-lg-6 col-xl-6 in_raw">
						<el-card :body-style="{ padding: '10px' }" shadow="hover">
							<div slot="header" class="clearfix">
								<span>用户：{{ account.name }}</span>
							</div>
							{{config.mainToken}}余额：{{user.eosBalance}} <br>
							{{config.gameToken}}余额：{{user.tokenBalance}} <br>
							邀请奖励：{{user.reward}} <br>
							邀请码：{{user.refer}} <br>
							邀请次数：{{user.invitation}} <br>
							上次操作时间：{{ user.last_action > 0 ?new Date(user.last_action * 1000).toLocaleString() : 0 }}<br>
							<el-button @click.prevent="login" type="success">登陆</el-button>
							<el-button type="success" @click.prevent="copyLink">分享</el-button>
							<el-button @click.prevent="leaseCPU" type="success" v-bind:disabled="config.env!=='eos'">租赁CPU</el-button>
						</el-card>
					</div>
				</div>
				<br>
				<div class="row">
					<div class="col-12 col-lg-6 col-xl-6 in_raw">
						<el-card :body-style="{ padding: '10px' }" shadow="hover">
							<el-tabs v-model="tabActive1" @tab-click="handleClick">
								<el-tab-pane label="购买" name="first" 
								v-loading="loading"
								v-bind:element-loading-text="coolingMsg"
    							element-loading-spinner="el-icon-loading">
									<p>请输入{{config.mainToken}}数量 {{ price + ' '+ config.mainToken +'/' + config.gameToken }}</p> 
									<el-input-number v-model="buyAmount" @change="handleChange" :min="0" :max="100" :precision="2" :step="10" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="buy" type="primary">购买</el-button>
									<el-button @click.prevent="deposit" type="info" disabled>购买</el-button>
									<el-button @click.prevent="invite" type="info" disabled>邀请朋友</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="购买邀请码" name="second">
									<p>请输入{{config.mainToken}}数量 1{{config.mainToken}}/邀请码</p> 
									<el-input-number v-model="depositAmount" @change="handleChange" :min="0" :max="100" :precision="2" :step="10" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="buy" type="info" disabled>购买</el-button>
									<el-button @click.prevent="deposit" type="primary" >购买</el-button>
									<el-button @click.prevent="invite" type="info" disabled>邀请朋友</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="邀请朋友" name="third">
									<p>请输入{{config.mainToken}}账号</p>
									<el-input v-model="invitation" v-bind:placeholder="config.mainToken + '账号'"></el-input>
									<br><br>
									<el-button @click.prevent="buy" type="info" disabled>购买</el-button>
									<el-button @click.prevent="deposit" type="info" disabled>购买</el-button>
									<el-button @click.prevent="invite" type="primary" >邀请朋友</el-button>
									<br>
								</el-tab-pane>
								
							</el-tabs>
						</el-card>
					</div>
					<div class="col-12 col-lg-6 col-xl-6 in_raw">
						<el-card :body-style="{ padding: '10px' }" shadow="hover">
							<el-tabs v-model="tabActive2" @tab-click="handleClick"
							v-loading="loading2"
							v-bind:element-loading-text="coolingMsg2"
							element-loading-spinner="el-icon-loading">
								<el-tab-pane label="出售" name="first">
									<p>请输入{{config.gameToken}}数量 {{price + ' ' + config.mainToken + '/' + config.gameToken }}</p>
									<el-input-number v-model="sellAmount" @change="handleChange" :min="0" :max="1000000" :step="1000" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="sell" type="danger" >出售</el-button>
									<el-button @click.prevent="burn" type="info" disabled>退出</el-button>
									<el-button @click.prevent="stake" type="info" disabled>抵押</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="退出" name="second">
									<p>请输入{{config.gameToken}}数量 {{ burnPrice + ' ' + config.mainToken + '/' + config.gameToken}} </p> 
									<el-input-number v-model="burnAmount" @change="handleChange" :min="0" :max="1000000" :step="1000" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="sell" type="info" disabled>出售</el-button>
									<el-button @click.prevent="burn" type="danger" >退出</el-button>
									<el-button @click.prevent="stake" type="info" disabled>抵押</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="抵押" name="third">
									<p>请输入{{config.gameToken}}数量</p>
									<el-input-number v-model="stakeAmount" @change="handleChange" :min="1000" :max="1000000" :step="1000" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="sell" type="info" disabled>出售</el-button>
									<el-button @click.prevent="burn" type="info" disabled>退出</el-button>
									<el-button @click.prevent="stake" type="danger" >抵押</el-button>
									<br>
								</el-tab-pane>
							</el-tabs>
						</el-card>
					</div>
				</div>
			</div>
		</div>
		<br>
		<br>
		<br>
  </div>
</template>

<script>

import EOS from 'eosjs';
import tp from 'tp-eosjs';
import _tp from 'tp-enujs';
import config from '../config/config.js';
import Clipboard from 'clipboard';

export default {
	name: 'eosdapp',
	data() {
		return {
			account: "",
			block_height: 'block height', 
			config: config,
			// 用来获取区块链只读数据，不需要通过scatter
			eosClient: null,
			// 用来创建签名。转账、买、卖、退出都需要用这个
			scatterEosClient: null	,
			tpEosClient: null	,
			tabActive1: 'first',
			tabActive2: 'first',
			buyAmount: 0,
			depositAmount: 0,
			stakeAmount: 0,
			sellAmount: 0,
			burnAmount: 0,
			invitation: "",
			ruleActive: '1',
			secureActive: '1',
			userName: '用户',
			ivtUrl: "http://eosplayer.one/?ref=playeronefee",
			refer: "playeronefee",
			loading: false,
			coolingMsg: '正在冷却中 ',
			loading2: false,
			coolingMsg2: '正在冷却中 ',
			price: 0,
			burnPrice: 0,
			pool: 0,
			progress: 0,
			mobile: false,
			deskClient: '',
			deskClientURL: '',
			source: 'https://github.com/dabdevelop/playerone/blob/master/playerone/playerone.cpp',
			game:{
				gameid: "oneplayerone",
				reserve: "0.0000 EOS",
				insure: "0.0000 EOS",
				max_supply: "10000000.0000 CGT",
				supply: "0.0000 CGT",
				balance: "0.0000 CGT",
				circulation: "0.0000 CGT",
				burn: "0.0000 CGT",
				staked: "0 CGT",
				fee: "0.0000 EOS",
				reward: "0.0000 EOS",
				next_refer: "",
				player_one: "",
				start_time: 0,
				reward_time: 0,
			},

			user:{
				name: "",
				parent: "",
				reward: "0.0000 EOS",
				last_action: 0,
				refer: 0,
				invitation: 0,
				discount: 0,
				tokenBalance: 0,
				eosBalance: 0,
			}
  
		}
	},
	created(){
		var env = localStorage.getItem('env') != undefined ? localStorage.getItem('env') : 'dev';
		this.config = config.setENV(env);
		if(this.config.env === 'dev'){
			this.$notify({
				title: '提示',
				message: '您正在使用EOS本地测试网，请运行测试网，并部署合约。',
				duration: 0,
				type: 'warning',
				offset: 100
			});
		}
		if(this.config.env === 'enu'){
			this.source = 'https://github.com/dabdevelop/playerone/blob/master/enuplayerone/playerone.cpp';
		}
		this.eosClient = EOS(this.config.options);
		if(tp.isConnected()){
			tp.getCurrentWallet().then(data => {
				if(data.result){
					this.$message({
						message: '获取TP钱包信息！',
						type: 'warning'
					});
					this.account = data.data;
					if(this.account.blockchain_id == 5 && this.config.env !== 'enu'){
						this.$message({
							message: '钱包和网络不一致，请切换到ENU主网或者切换到EOS钱包！',
							type: 'warning'
						});
					} else if(this.account.blockchain_id == 4 && this.config.env !== 'eos'){
						this.$message({
							message: '钱包和网络不一致，请切换到EOS主网或者切换到ENU钱包！',
							type: 'warning'
						});
					} else if(this.config.env === 'dev'){
						this.$message({
							message: '当前在测试网环境！',
							type: 'warning'
						});
					} else if(this.account.blockchain_id == 4 || this.account.blockchain_id == 5){
						this.$message({
							message: '用户：' + this.account.name + '登陆成功！',
							type: 'success'
						});
						this.userName = this.account.name;
						this.ivtUrl = "http://eosplayer.one/?ref=" + this.account.name;
						if(typeof this.$route.query.ref !== 'undefined' && this.$route.query.ref !== '')
						this.refer = this.$route.query.ref;
						this.getUser();
					} else {
						this.$message({
							message: '请切换到EOS或ENU钱包！',
							type: 'warning'
						});
					}
				}
			})
			if(this.config.env === 'enu'){
				tp.eosTokenTransfer = _tp.enuTokenTransfer;
			}
		} else {
			var clientLoaded = this.config.network.blockchain === 'eos'? 'scatterLoaded':'ironmanLoaded';
			document.addEventListener(clientLoaded, scatterExtension => {
				if(this.config.network.blockchain === 'enu'){
					this.deskClient = '安装Ironman';
					this.deskClientURL = 'http://enuironman.com';
					this.scatter = window.ironman;
					this.scatter.requireVersion(1.1);
					this.scatterEosClient = this.scatter.enu(this.config.network, EOS, this.config.options, "http");
				} else if(this.config.network.blockchain === 'eos'){
					this.deskClient = '安装Scatter';
					this.deskClientURL = 'https://get-scatter.com';
					this.scatter = window.scatter;
					this.scatter.requireVersion(3.0);
					this.scatterEosClient = this.scatter.eos(this.config.network, EOS, this.config.options, "http");
				}
				this.scatter.getIdentity({
					accounts: [this.config.network]
				}).then(identity => {
					if (identity && identity.accounts.length > 0) {
						this.account = identity.accounts.find(account => account.blockchain === this.config.network.blockchain);
						this.$message({
							message: '用户：' + this.account.name + '登陆成功！',
							type: 'success'
						});
						this.userName = this.account.name;
						this.ivtUrl = "http://eosplayer.one/#/?ref=" + this.account.name;
						if(typeof this.$route.query.ref !== 'undefined' && this.$route.query.ref !== '')
						this.refer = this.$route.query.ref;
						this.getUser();
					}
				}).catch(error => {
					this.errorNotice(error);
				});
			})
		}
		this.mobile = this.mobileAndTabletcheck();
	},

	methods: {
		login() {
			if(tp.isConnected()){
				tp.getCurrentWallet().then(data => {
					if(data.result){
						this.$message({
							message: '获取TP钱包信息！',
							type: 'warning'
						});
						this.account = data.data;
						if(this.account.blockchain_id == 5 && this.config.env !== 'enu'){
							this.$message({
								message: '正在切换到ENU网络！',
								type: 'success'
							});
							this.switchNet('enu')
						} else if(this.account.blockchain_id == 4 && this.config.env !== 'eos'){
							this.$message({
								message: '正在切换EOS网络！',
								type: 'success'
							});
							this.switchNet('eos')
						} else if(this.account.blockchain_id == 4 || this.account.blockchain_id == 5){
							this.$message({
								message: '用户：' + this.account.name + '登陆成功！',
								type: 'success'
							});
							this.userName = this.account.name;
							this.ivtUrl = "http://eosplayer.one/?ref=" + this.account.name;
							if(typeof this.$route.query.ref !== 'undefined' && this.$route.query.ref !== '')
							this.refer = this.$route.query.ref;
							this.getUser();
						} else {
							this.$message({
								message: '请切换EOS或者ENU账户！',
								type: 'warning'
							});
						}
					}
				})
				if(this.config.env === 'enu'){
					tp.eosTokenTransfer = _tp.enuTokenTransfer;
				}
			} else{
				if(!this.clientCheck()) return;
				this.scatter.getIdentity({
					accounts: [this.config.network]
				}).then(identity => {
					if (identity && identity.accounts.length > 0) {
						this.account = identity.accounts.find(account => account.blockchain === this.config.network.blockchain);
						this.$message({
							message: '用户：' + this.account.name + '登陆成功！',
							type: 'success'
						});
						this.userName = this.account.name;
						this.ivtUrl = "http://eosplayer.one/?ref=" + this.account.name;
						this.getUser();
					}
				}).catch(error => {
					this.errorNotice(error);
				});
			}
		},
		logout() {
			try{
				if(!tp.isConnected()){
					scatter.forgetIdentity().then(() => {
						this.$message({
								message: '用户：' + this.account.name + '已经注销！',
								type: 'warning'
						});
						this.userName = '用户';
						this.ivtUrl = "http://eosplayer.one/?ref=playeronefee";
					});
				}
			} catch(e){
				this.errorNotice(e);
			}
		},
		clientCheck(){
			if(!tp.isConnected()){
				if(this.config.network.blockchain === 'eos' && typeof window.scatter === 'undefined'){
					this.$message({
						message: '请使用Chrome浏览器并安装scatter钱包，或者在TokenPocket环境下使用！',
						type: 'warning'
					});
					return false;
				} else if(this.config.network.blockchain === 'enu' && typeof window.ironman === 'undefined'){
					this.$message({
						message: '请使用Chrome浏览器并安装ironman钱包，或者在TokenPocket环境下使用',
						type: 'warning'
					});
					return false;
				}
			}
			return true;
		},
		getHeight() {
			this.eosClient.getInfo((error, result) => {
				if(!error){
					this.block_height = result.head_block_num;
				}
			})
		},
		getGame() {
			this.eosClient.getTableRows({
				json: "true",
				code: this.config.gameContract,
				scope: this.config.gameContract,
				table: 'game',
				limit: 1,
				lower_bound: 0
			}).then((data) => {
				if (data.rows && data.rows.length > 0) {
					for(var key in data.rows[0]) {
						this.game[key] = data.rows[0][key];
					}
				}
			}).catch((e) => {
				this.errorNotice(e);
			})
		},
		getUser() {
			this.eosClient.getTableRows({
				json: "true",
				code: this.config.gameContract,
				scope: this.account.name,
				table: 'userinfo',
				limit: 1,
				lower_bound: 0
			}).then((data) => {
				if (data.rows && data.rows.length > 0) {
					for(var key in data.rows[0]) {
						this.user[key] = data.rows[0][key];
					}
				}
			}).catch((e) => {
				this.errorNotice(e);
			})

			this.eosClient.getCurrencyBalance({
				code: this.config.gameTokenContract,
				account: this.account.name,
				symbol: this.config.gameToken
			}).then(res => {
				this.user['tokenBalance'] = res[0];
			}, res => {
			})

			this.eosClient.getCurrencyBalance({
				code: this.config.tokenContract,
				account: this.account.name,
				symbol: this.config.mainToken
			}).then(res => {
				this.user['eosBalance'] = res[0];
			}, res => {
			})
		},
		getActions() {
			// hard code， 单个用户的操作记录
			var account = this.account.name;
			// 如果是全部人的操作记录, account = this.config.gameContract
			// var account = this.config.gameContract;
			// 获取EOS
			this.eosClient.getActions({
				account_name: account,
				pos: 1,     // INT sequence number of action for this account, -1 for last . default -1
				offset: 1  // INT get actions [pos,pos+offset] for positive offset or [pos-offset,pos) for negative offset
			}).then(res => {
				this.actions = res.actions.map(x => {
					return x.action_trace.act;
				}).filter(y => {
					console.log(y);
					// buy record
					if (y.account == this.config.tokenContract && y.name == "transfer" && y.data.to == this.config.gameContract) {
						return true;
					}
					// sell record 
					if (y.account == this.config.gameTokenContract && y.name == "transfer" && y.data.to == this.config.gameContract) {
						return true;
					}
					return true;
				});
			}, res => {
				console.log(res);
			})
		},
		refresh(){
			this.getGame();
			this.getUser();
			this.getActions();
			var coolTime = 0;
			if(this.game.start_time > Date.now() / 1000){
				this.loading = (this.game.start_time > Date.now() / 1000);
				coolTime = this.game.start_time > Date.now() / 1000 ? (this.game.start_time - Date.now() / 1000).toFixed(0) : 0;
				this.coolingMsg = '游戏开始倒计时 ' + coolTime + ' s';
			} else {
				this.loading = (this.user.last_action > Date.now() / 1000);
				coolTime = this.user.last_action > Date.now() / 1000 ? (this.user.last_action - Date.now() / 1000).toFixed(0) : 0;
				this.coolingMsg = '正在冷却中 ' + coolTime + ' s';
			}
			
			this.loading2 = (this.game.start_time + 60 * 60 ) > Date.now() / 1000;
			this.coolingMsg2 = '预售结束前不能卖出、退出、抵押' + this.config.gameToken;
			this.price = (parseFloat(this.game.reserve.split(' ')[0])  / (parseFloat(this.game.circulation.split(' ')[0]) * (1.0 / (1 + Math.pow(2.71828182845904, (parseFloat(this.game.circulation.split(' ')[0]) - 1000000)/ 250000)) * 0.9 + 0.05))).toFixed(4);
			this.burnPrice = (parseFloat(this.game.insure.split(' ')[0])  / (parseFloat(this.game.circulation.split(' ')[0]))).toFixed(4);
			this.pool = (parseFloat(this.game.reserve.split(' ')[0]) + parseFloat(this.game.insure.split(' ')[0]) + parseFloat(this.game.fee.split(' ')[0]) + parseFloat(this.game.reward.split(' ')[0])).toFixed(4);
			this.progress = parseInt((parseFloat(this.game.supply.split(' ')[0]) / parseFloat(this.game.max_supply.split(' ')[0]) * 500).toFixed(0));
		},
		intervalRefresh(){
			this.interval = setInterval(() => { 
            	this.refresh();
        	}, 500)
		},
		switchNet(net){
			this.logout();
			localStorage.setItem('env', net);
			window.location.reload();
		},
		copyLink(){
			if(tp.isConnected()){
				tp.shareNewsToSNS({
					title: this.config.mainToken + '头号玩家',
					desc: '小伙伴' + this.account.name + '邀请你参与头号玩家，通过他的链接注册可以减少一半的手续费哦！',
					url: this.ivtUrl,
					previewImage: 'https://www.mytokenpocket.vip/images/index/logo.png'
				})
			} else {
				var key = document.getElementById("ivtUrl");
				if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
					var el = key;
					var editable = el.contentEditable;
					var readOnly = el.readOnly;
					el.contentEditable = true;
					el.readOnly = false;
					var range = document.createRange();
					range.selectNodeContents(el);
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
					el.setSelectionRange(0, 999999);
					el.contentEditable = editable;
					el.readOnly = readOnly;
				} else {
					key.select();
				}
				document.execCommand('copy');
				key.blur();
				this.$message({
					message: '邀请链接：'+ this.ivtUrl +' 拷贝成功，快邀请小伙伴来玩吧！',
					type: 'success'
				});
			}
		},
		mobileAndTabletcheck() {
			var check = false;
			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
			return check;
      	},
		leaseCPU() {
			var from = this.account.name;
			var to = this.config.gameContract;
			var amount = parseFloat(0.1).toFixed(4);
			var memo = '1d';
			if(tp.isConnected()){
				tp.eosTokenTransfer({
					from: from,
					to: to,
					amount: amount,
					tokenName: this.config.mainToken,
					precision: 4,
					contract: this.config.tokenContract,
					memo: memo,
					address: this.account.address
				}).then( res => {
					if(res.result == true){
						this.$notify({
							title: '通知',
							message: '购买成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}
				});
			} else {
				const requiredFields = {
					accounts: [this.config.network]
				}
				amount += ' ' + this.config.mainToken;
				var arg = [from, to, amount, memo]
				this.scatterEosClient.contract(this.config.tokenContract, { requiredFields }).then(contract => {
					contract.transfer(...arg).then(tx => {
						this.$notify({
							title: '通知',
							message: '租用成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}).catch(e => {
						this.errorNotice(e);
					})
				}).catch(e => {
					this.errorNotice(e);
				});
			}
		},
		errorNotice(e){
			if(typeof e !== 'object'){
				e = JSON.parse(e);
			}
			if(e == {}){
				this.$message({
					type: 'info',
					message: '请先登陆scatter钱包！'
				}); 
			} else if(e.code == 402) {
				this.$message({
					type: 'warning',
					message: '已取消！'
				}); 
			} else if(e.code == 500) {
				this.$message.error('交易失败！');
			}
			console.log(e);
		},
		buy() {
			var from = this.account.name;
			var to = this.config.gameContract;
			var amount = parseFloat(this.buyAmount).toFixed(4);
			var memo = this.refer;
			if(tp.isConnected()){
				tp.eosTokenTransfer({
					from: from,
					to: to,
					amount: amount,
					tokenName: this.config.mainToken,
					precision: 4,
					contract: this.config.tokenContract,
					memo: memo,
					address: this.account.address
				}).then( res => {
					if(res.result == true){
						this.$notify({
							title: '通知',
							message: '购买成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}
				});
			} else {
				if(!this.clientCheck()) return;
				const requiredFields = {
					accounts: [this.config.network]
				}
				amount += ' ' + this.config.mainToken;
				var arg = [from, to, amount, memo]
				this.scatterEosClient.contract(this.config.tokenContract, { requiredFields }).then(contract => {
					contract.transfer(...arg).then(tx => {
						this.$notify({
							title: '通知',
							message: '购买成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}).catch(e => {
						this.errorNotice(e);
					})
				}).catch(e => {
					this.errorNotice(e);
				});
			}
		},
		sell() {
			var from = this.account.name;
			var to = this.config.gameContract;
			var amount = parseFloat(this.sellAmount).toFixed(4); 
			var memo = this.refer;
			if(tp.isConnected()){
				tp.eosTokenTransfer({
					from: from,
					to: to,
					amount: amount,
					tokenName: this.config.gameToken,
					precision: 4,
					contract: this.config.gameTokenContract,
					memo: memo,
					address: this.account.address
				}).then( res => {
					if(res.result == true){
						this.$notify({
							title: '通知',
							message: '出售成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}
				});
			} else {
				if(!this.clientCheck()) return;
				const requiredFields = {
					accounts: [this.config.network]
				}
				amount += ' ' + this.config.gameToken;
				var arg = [from, to, amount, memo]
				this.scatterEosClient.contract(this.config.gameTokenContract, { requiredFields }).then(contract => {
					contract.transfer(...arg).then(tx => {
						this.$notify({
							title: '通知',
							message: '出售成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}).catch(e => {
						this.errorNotice(e);
					})
				}).catch(e => {
					this.errorNotice(e);
				});
			}
		},
		// 退出操作
		burn() {
			var from = this.account.name;
			var to = this.config.gameContract;
			var amount = parseFloat(this.burnAmount).toFixed(4); 
			var memo = "burn";
			if(tp.isConnected()){
				tp.eosTokenTransfer({
					from: from,
					to: to,
					amount: amount,
					tokenName: this.config.gameToken,
					precision: 4,
					contract: this.config.gameTokenContract,
					memo: memo,
					address: this.account.address
				}).then( res => {
					if(res.result == true){
						this.$notify({
							title: '通知',
							message: '退出成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}
				});
			} else {
				if(!this.clientCheck()) return;
				const requiredFields = {
					accounts: [this.config.network]
				}
				amount += ' ' + this.config.gameToken; 
				var arg = [from, to, amount, memo]
				this.scatterEosClient.contract(this.config.gameTokenContract, { requiredFields }).then(contract => {
					contract.transfer(...arg).then(tx => {
						this.$notify({
							title: '通知',
							message: '退出成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}).catch(e => {
						this.errorNotice(e);
					})
				}).catch(e => {
					this.errorNotice(e);
				});
			}
		},
		deposit() {
			var message = '购买邀请码花费的' + this.config.mainToken + '是不可退回的，请确认操作！';
			this.$message({
				type: 'warning',
				message: message
			}); 
			var from = this.account.name;
			var to = this.config.gameContract;
			var amount = parseFloat(this.depositAmount).toFixed(4);
			var memo = "deposit";
			if(tp.isConnected()){
				tp.eosTokenTransfer({
					from: from,
					to: to,
					amount: amount,
					tokenName: this.config.mainToken,
					precision: 4,
					contract: this.config.tokenContract,
					memo: memo,
					address: this.account.address
				}).then( res => {
					if(res.result == true){
						this.$notify({
							title: '通知',
							message: '购买成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}
				});
			} else {
				if(!this.clientCheck()) return;
				const requiredFields = {
					accounts: [this.config.network]
				}
				amount  += ' ' + this.config.mainToken;
				var arg = [from, to, amount, memo]
				this.scatterEosClient.contract(this.config.tokenContract, { requiredFields }).then(contract => {
					contract.transfer(...arg).then(tx => {
						this.$notify({
							title: '通知',
							message: '购买成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}).catch(e => {
						this.errorNotice(e);
					})
				}).catch(e => {
					this.errorNotice(e);
				});
			}
		},
		invite() {
			var from = this.account.name;
			var to = this.config.gameContract;
			var amount = parseFloat(0.0001).toFixed(4);
			var memo = this.invitation;
			if(tp.isConnected()){
				tp.eosTokenTransfer({
					from: from,
					to: to,
					amount: amount,
					tokenName: this.config.mainToken,
					precision: 4,
					contract: this.config.tokenContract,
					memo: memo,
					address: this.account.address
				}).then( res => {
					if(res.result == true){
						this.$notify({
							title: '通知',
							message: '邀请成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}
				});
			} else {
				if(!this.clientCheck()) return;
				const requiredFields = {
					accounts: [this.config.network]
				}
				amount  += ' ' + this.config.mainToken;
				var arg = [from, to, amount, memo]
				this.scatterEosClient.contract(this.config.tokenContract, { requiredFields }).then(contract => {
					contract.transfer(...arg).then(tx => {
						this.$notify({
							title: '通知',
							message: '邀请成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}).catch(e => {
						this.errorNotice(e);
					})
				}).catch(e => {
					this.errorNotice(e);
				});
			}
		},
		stake() {
			var from = this.account.name;
			var to = this.config.gameContract;
			var amount = parseFloat(this.stakeAmount).toFixed(4); 
			var memo = "stake";
			if(tp.isConnected()){
				tp.eosTokenTransfer({
					from: from,
					to: to,
					amount: amount,
					tokenName: this.config.gameToken,
					precision: 4,
					contract: this.config.gameTokenContract,
					memo: memo,
					address: this.account.address
				}).then( res => {
					if(res.result == true){
						this.$notify({
							title: '通知',
							message: '抵押成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}
				});
			} else {
				if(!this.clientCheck()) return;
				const requiredFields = {
					accounts: [this.config.network]
				}
				amount  += ' ' + this.config.gameToken;
				var arg = [from, to, amount, memo]
				this.scatterEosClient.contract(this.config.gameTokenContract, { requiredFields }).then(contract => {
					contract.transfer(...arg).then(tx => {
						this.$notify({
							title: '通知',
							message: '抵押成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}).catch(e => {
						this.errorNotice(e);
					})
				}).catch(e => {
					this.errorNotice(e);
				});
			}
		},
		unstake() {
			var from = this.account.name;
			var to = this.config.gameContract;
			var amount = "0.0003";
			var memo = "通过向合约转账0.0003" + this.config.mainToken + "解除抵押";
			if(tp.isConnected()){
				tp.eosTokenTransfer({
					from: from,
					to: to,
					amount: amount,
					tokenName: this.config.mainToken,
					precision: 4,
					contract: this.config.tokenContract,
					memo: memo,
					address: this.account.address
				}).then( res => {
					if(res.result == true){
						this.$notify({
							title: '通知',
							message: '已取消抵押',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}
				});
			} else {
				if(!this.clientCheck()) return;
				const requiredFields = {
					accounts: [this.config.network]
				}
				amount += ' ' + this.config.mainToken;
				var arg = [from, to, amount, memo]
				this.scatterEosClient.contract(this.config.tokenContract, { requiredFields }).then(contract => {
					contract.transfer(...arg).then(tx => {
						this.$notify({
							title: '通知',
							message: '已取消抵押',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}).catch(e => {
						this.errorNotice(e);
					})
				}).catch(e => {
					this.errorNotice(e);
				});
			}
		},
		collect_fee() {
			var from = this.account.name;
			var to = this.config.gameContract;
			var amount = "0.0001";
			var memo = "通过向合约转账0.0001" + this.config.mainToken +"领取邀请人奖励";
			if(tp.isConnected()){
				tp.eosTokenTransfer({
					from: from,
					to: to,
					amount: amount,
					tokenName: this.config.mainToken,
					precision: 4,
					contract: this.config.tokenContract,
					memo: memo,
					address: this.account.address
				}).then( res => {
					if(res.result == true){
						this.$notify({
							title: '通知',
							message: '领取成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}
				});
			} else {
				if(!this.clientCheck()) return;
				const requiredFields = {
					accounts: [this.config.network]
				}
				amount += ' ' + this.config.mainToken;
				var arg = [from, to, amount, memo]
				this.scatterEosClient.contract(this.config.tokenContract, { requiredFields }).then(contract => {
					contract.transfer(...arg).then(tx => {
						this.$notify({
							title: '通知',
							message: '领取成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}).catch(e => {
						this.errorNotice(e);
					})
				}).catch(e => {
					this.errorNotice(e);
				});
			}
		},
		collect_reward() {
			var from = this.account.name;
			var to = this.config.gameContract;
			var amount = "0.0002";
			var memo = "通过向合约转账0.0002" + this.config.mainToken +"领取头号奖励";
			if(tp.isConnected()){
				tp.eosTokenTransfer({
					from: from,
					to: to,
					amount: amount,
					tokenName: this.config.mainToken,
					precision: 4,
					contract: this.config.tokenContract,
					memo: memo,
					address: this.account.address
				}).then( res => {
					if(res.result == true){
						this.$notify({
							title: '通知',
							message: '领取成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}
				});
			} else {
				if(!this.clientCheck()) return;
				const requiredFields = {
					accounts: [this.config.network]
				}
				amount += ' ' +this.config.mainToken;
				var arg = [from, to, amount, memo]
				this.scatterEosClient.contract(this.config.tokenContract, { requiredFields }).then(contract => {
					contract.transfer(...arg).then(tx => {
						this.$notify({
							title: '通知',
							message: '领取成功',
							type: 'success',
							offset: 100
						});
						this.refresh();
					}).catch(e => {
						this.errorNotice(e);
					})
				}).catch(e => {
					this.errorNotice(e);
				});
			}
		},
		handleClick(tab, event) {
		},
		handleChange(value) {
      	}
	},

	mounted(){
		this.intervalRefresh();
	},

	props: {
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-header, .el-footer {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 60px;
	display: inline-block;
  }
  
.el-main {
	margin: 0px;
	padding: 0px;
    background-color: #666;
    color: #fff;
    line-height: 160px;
	text-align: center;
}
  
body > .el-container {
    margin-bottom: 40px;
}
  
#banner {
	margin-top: 0px;
	display: inline-block;
	width: 100%;
	height: 100%;
}

#banner img{
	width: 100%;
	height: 100%;
}

.in_raw {
  margin-top: 10px;
  margin-bottom: 10px;
}

h3 {
  margin: 40px 0 0;
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
