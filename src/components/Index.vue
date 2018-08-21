<template>
    <div id="eosdapp">
		<!-- 头号玩家合约安全规则说明路线图代码开源免责说明 -->
		<b-navbar toggleable="md" type="light" variant="light">
			<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
			<b-navbar-brand href="#">EOS头号玩家</b-navbar-brand>
			<b-collapse is-nav id="nav_collapse">
				<b-navbar-nav>
					<b-nav-item href="https://github.com/dabdevelop/playerone/blob/master/playerone/playerone.cpp">合约开源</b-nav-item>
				</b-navbar-nav>
				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-nav-form>
						<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="EOS用户名" v-model="ivtUrl" id="ivtUrl"/>
						<b-button size="sm" variant="outline-success" class="my-2 my-sm-0" @click.prevent="copyLink">复制邀请链接</b-button>
					</b-nav-form>
					<b-nav-item-dropdown text="语言" right>
						<b-dropdown-item href="#">ZH</b-dropdown-item>
						<b-dropdown-item href="#">EN</b-dropdown-item>
					</b-nav-item-dropdown>
					<b-nav-item-dropdown right>
						<!-- Using button-content slot -->
						<template slot="button-content">
							<b>{{ userName }}</b>
						</template>
						<b-dropdown-item @click.prevent="login">登录</b-dropdown-item>
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
					<div class="col-12 col-lg-6 col-xl-6">
						<el-card :body-style="{ padding: '10px' }" shadow="hover">
							<div slot="header" class="clearfix">
								<span>合约信息</span>
								<el-button @click.prevent="getGame" type="primary" style="float: right;" icon="el-icon-refresh" circle></el-button>
							</div>
							储备金：{{game.reserve}}
							保证金：{{game.insure}}
							发行量：{{game.supply}}
							代币余额：{{game.balance}}
							流通量：{{game.circulation}}
							销毁量：{{game.burn}}
							头号抵押：{{game.staked}}
							邀请奖金池：{{game.fee}}
							头号奖金池：{{game.reward}}
							下一个邀请码：{{game.next_refer}}
							头号：{{game.player_one}}
							开始时间：{{game.start_time}}
							头号奖励时间：{{game.reward_time}}
							买卖价格：{{ (parseFloat(game.reserve.split(' ')[0])  / (parseFloat(game.circulation.split(' ')[0]) * (1.0 / (1 + Math.pow(2.71828182845904, (parseFloat(game.circulation.split(' ')[0]) - 1000000)/ 250000)) * 0.9 + 0.05))).toFixed(6)  }}
							销毁价格：{{ (parseFloat(game.insure.split(' ')[0])  / (parseFloat(game.circulation.split(' ')[0]))).toFixed(6)  }}
						</el-card>
					</div>
					<div class="col-12 col-lg-6 col-xl-6">
						<el-card :body-style="{ padding: '10px' }" shadow="hover">
							<div slot="header" class="clearfix">
								<span>用户信息</span>
								<el-button type="primary" @click.prevent="getUser"  style="float: right;" icon="el-icon-refresh" circle></el-button>
							</div>
							用户名：{{user.name}}
							EOS余额：{{user.eosBalance}}
							CGT余额：{{user.tokenBalance}}
							邀请奖金：{{user.reward}}
							上次操作时间：{{user.last_action}}
							邀请码数量：{{user.refer}}
							邀请数量：{{user.invitation}}
						</el-card>
					</div>
				</div>
				<br>
				<div class="row">
					<div class="col-12 col-lg-6 col-xl-6">
						<el-card :body-style="{ padding: '10px' }" shadow="hover">
							<el-tabs v-model="tabActive1" @tab-click="handleClick">
								<el-tab-pane label="购买CGT" name="first">
									<p>请输入EOS数量</p>
									<el-input-number v-model="buyAmount" @change="handleChange" :min="0" :max="100" :precision="2" :step="10" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="buy" type="primary" >购买CGT</el-button>
									<el-button @click.prevent="deposit" type="info" disabled>购买邀请码</el-button>
									<el-button @click.prevent="invite" type="info" disabled>邀请朋友</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="购买邀请码" name="second">
									<p>请输入EOS数量</p>
									<el-input-number v-model="depositAmount" @change="handleChange" :min="0" :max="100" :precision="2" :step="10" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="buy" type="info" disabled>购买CGT</el-button>
									<el-button @click.prevent="deposit" type="primary" >购买邀请码</el-button>
									<el-button @click.prevent="invite" type="info" disabled>邀请朋友</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="邀请朋友" name="third">
									<p>请输入EOS账号</p>
									<el-input v-model="invitation" placeholder="EOS账号"></el-input>
									<br><br>
									<el-button @click.prevent="buy" type="info" disabled>购买CGT</el-button>
									<el-button @click.prevent="deposit" type="info" disabled>购买邀请码</el-button>
									<el-button @click.prevent="invite" type="primary" >邀请朋友</el-button>
									<br>
								</el-tab-pane>
								
							</el-tabs>
						</el-card>
					</div>
					<div class="col-12 col-lg-6 col-xl-6">
						<el-card :body-style="{ padding: '10px' }" shadow="hover">
							<el-tabs v-model="tabActive2" @tab-click="handleClick">
								<el-tab-pane label="出售CGT" name="first">
									<p>请输入CGT数量</p>
									<el-input-number v-model="sellAmount" @change="handleChange" :min="0" :max="1000000" :step="1000" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="sell" type="danger" >出售CGT</el-button>
									<el-button @click.prevent="burn" type="info" disabled>销毁CGT</el-button>
									<el-button @click.prevent="stake" type="info" disabled>抵押CGT</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="销毁CGT" name="second">
									<p>请输入CGT数量</p>
									<el-input-number v-model="burnAmount" @change="handleChange" :min="0" :max="1000000" :step="1000" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="sell" type="info" disabled>出售CGT</el-button>
									<el-button @click.prevent="burn" type="danger" >销毁CGT</el-button>
									<el-button @click.prevent="stake" type="info" disabled>抵押CGT</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="抵押CGT" name="third">
									<p>请输入CGT数量</p>
									<el-input-number v-model="stakeAmount" @change="handleChange" :min="1000" :max="1000000" :step="1000" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="sell" type="info" disabled>出售CGT</el-button>
									<el-button @click.prevent="burn" type="info" disabled>销毁CGT</el-button>
									<el-button @click.prevent="stake" type="danger" >抵押CGT</el-button>
									<br>
								</el-tab-pane>
							</el-tabs>
						</el-card>
					</div>
				</div>
			</div>
		</div>

  </div>
</template>

<script>

import EOS from 'eosjs';
import config from '../config/config.js'

export default {
	name: 'eosdapp',
	data() {
		return {
			account: "",
			block_height: 'block height', 
			config: config,
			// 用来获取区块链只读数据，不需要通过scatter
			eosClient: null,
			// 用来创建签名。转账、买、卖、销毁都需要用这个
			scatterEosClient: null	,
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
			game:{
				gameid: "oneplayerone",
				reserve: "0.0000 EOS",
				insure: "0.0000 EOS",
				max_supply: "10000000.0000 CGT",
				supply: "0.0000 CGT",
				balance: "0.0000 CGT",
				circulation: "0.0000 CGT",
				burn: "0.0000 CGT",
				staked: "0.0000 CGT",
				fee: "0.0000 EOS",
				reward: "0.0000 EOS",
				next_refer: "",
				player_one: "",
				start_time: 0,
				reward_time: 0
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
		this.eosClient = EOS(config.eosOptions);
		document.addEventListener('scatterLoaded', scatterExtension => {
			this.scatter = window.scatter;
			this.scatter.requireVersion(3.0);
			this.scatterEosClient = this.scatter.eos(config.eosNetwork, EOS, config.eosOptions, "http");
			this.scatter.getIdentity({
				accounts: [config.eosNetwork]
			}).then(identity => {
				if (identity && identity.accounts.length > 0) {
					this.account = identity.accounts.find(account => account.blockchain === 'eos');
					this.$message({
						message: '用户：' + this.account.name + '登陆成功！',
						type: 'success'
					});
					this.userName = this.account.name;
					this.ivtUrl = "http://eosplayer.one/?ref=" + this.account.name;
					if(typeof this.$route.query.ref !== 'undefined' && this.$route.query.ref !== '')
					this.refer = this.$route.query.ref;
					this.getUser();
				}
			}).catch(error => {
				this.$message({
						message: '登陆失败！',
						type: 'danger'
				});
			});
		})


		
	},

	methods: {
		login() {
			if(window.scatter == null){
				this.$message({
						message: '请先安装scatter钱包！',
						type: 'warning'
				});
			} else {
				this.scatter.getIdentity({
					accounts: [config.eosNetwork]
				}).then(identity => {
					if (identity && identity.accounts.length > 0) {
						this.account = identity.accounts.find(account => account.blockchain === 'eos');
						this.$message({
							message: '用户：' + this.account.name + '登陆成功！',
							type: 'success'
						});
						this.userName = this.account.name;
						this.ivtUrl = "http://eosplayer.one/?ref=" + this.account.name;
						this.getUser();
					}
				}).catch(error => {
					this.$message({
							message: '登陆失败！',
							type: 'danger'
					});
				});
			}
		},
		logout() {
			scatter.forgetIdentity().then(() => {
				this.$message({
						message: '用户：' + this.account.name + '已经注销！',
						type: 'warning'
				});
				this.userName = '用户';
				this.ivtUrl = "http://eosplayer.one/?ref=playeronefee";
			});
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
				code: config.gameContract,
				scope: config.gameContract,
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
				console.error(e);
			})
		},
		getUser() {
			this.eosClient.getTableRows({
				json: "true",
				code: config.gameContract,
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
				console.error(e);
			})

			this.eosClient.getCurrencyBalance({
				code: config.gameTokenContract,
				account: this.account.name,
				symbol: config.gameToken
			}).then(res => {
				this.user['tokenBalance'] = res[0];
			}, res => {
				console.log(res);
			})

			this.eosClient.getCurrencyBalance({
				code: config.tokenContract,
				account: this.account.name,
				symbol: config.mainToken
			}).then(res => {
				this.user['eosBalance'] = res[0];
			}, res => {
				console.log(res);
			})
		},
		getActions() {
			// hard code， 单个用户的操作记录
			var account = this.account.name;
			// 如果是全部人的操作记录, account = config.gameContract
			// var account = config.gameContract;
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
					if (y.account == config.tokenContract && y.name == "transfer" && y.data.to == config.gameContract) {
						return true;
					}
					// sell record 
					if (y.account == config.gameTokenContract && y.name == "transfer" && y.data.to == config.gameContract) {
						return true;
					}
					return false;
				});
			}, res => {
				console.log(res);
			})
		},
		refresh(){
			this.getGame();
			this.getUser();
			this.getActions();
		},
		intervalRefresh(){
			setInterval(() => { 
            	this.refresh();
        	}, 500)
		},
		copyLink(){
			var key = document.getElementById("ivtUrl");
			if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
				var el = key.get(0);
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
			// alert('私钥拷贝成功');
		},
		buy() {
			const requiredFields = {
				accounts: [config.eosNetwork]
			}
			// hard code
			var from = this.account.name;
			var to = config.gameContract;
			var amount = parseFloat(this.buyAmount).toFixed(4) + ' ' + config.mainToken;
			var memo = this.refer;
			var arg = [from, to, amount, memo]
			this.scatterEosClient.contract(config.tokenContract, { requiredFields }).then(contract => {
				contract.transfer(...arg).then(tx => {
					this.$notify({
						title: '通知',
						message: '购买成功',
						offset: 100
					});
					this.refresh();
				}).catch(e => {
					console.log(e)
				})
			}).catch(e => {
				console.log(e)
			});
		},
		sell() {
			const requiredFields = {
				accounts: [config.eosNetwork]
			}
			// hard code
			var from = this.account.name;
			var to = config.gameContract;
			var amount = parseFloat(this.sellAmount).toFixed(4) + ' ' + config.gameToken; 
			var memo = this.refer;
			var arg = [from, to, amount, memo]
			this.scatterEosClient.contract(config.gameTokenContract, { requiredFields }).then(contract => {
				contract.transfer(...arg).then(tx => {
					this.$notify({
						title: '通知',
						message: '出售成功',
						offset: 100
					});
					this.refresh();
				}).catch(e => {
					console.log(e)
				})
			}).catch(e => {
				console.log(e)
			});
		},
		// 销毁操作
		burn() {
			const requiredFields = {
				accounts: [config.eosNetwork]
			}
			// hard code
			var from = this.account.name;
			var to = config.gameContract;
			var amount = parseFloat(this.burnAmount).toFixed(4) + ' ' + config.gameToken; 
			var memo = "burn";
			var arg = [from, to, amount, memo]
			this.scatterEosClient.contract(config.gameTokenContract, { requiredFields }).then(contract => {
				contract.transfer(...arg).then(tx => {
					this.$notify({
						title: '通知',
						message: '销毁成功',
						offset: 100
					});
					this.refresh();
				}).catch(e => {
					console.log(e)
				})
			}).catch(e => {
				console.log(e)
			});
		},
		deposit() {
			this.$confirm('购买邀请码花费的EOS是不可退回的，是否购买?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				const requiredFields = {
					accounts: [config.eosNetwork]
				}
				// hard code
				var from = this.account.name;
				var to = config.gameContract;
				var amount = parseFloat(this.depositAmount).toFixed(4) + ' ' + config.mainToken;
				var memo = "deposit";
				var arg = [from, to, amount, memo]
				this.scatterEosClient.contract(config.tokenContract, { requiredFields }).then(contract => {
					contract.transfer(...arg).then(tx => {
						this.$notify({
							title: '通知',
							message: '购买成功',
							offset: 100
						});
						this.refresh();
					}).catch(e => {
						if(typeof e.code === 'undefined'){
							this.$message({
								type: 'info',
								message: '请先登陆scatter钱包！'
							}); 
						} else if(e.code == 402) {
							this.$message({
								type: 'info',
								message: '已取消！'
							}); 
						}  
					})
				}).catch(e => {
					if(e == {}){
						this.$message({
							type: 'info',
							message: '请先登陆scatter钱包！'
						}); 
					} else if(e.code == 402) {
						this.$message({
							type: 'info',
							message: '已取消！'
						}); 
					}
					 
				});
			}).catch(() => {
				if(typeof e.code === 'undefined'){
					this.$message({
						type: 'info',
						message: '请先登陆scatter钱包！'
					}); 
				} else if(e.code == 402) {
					this.$message({
						type: 'info',
						message: '已取消！'
					}); 
				}            
			});
		},
		invite() {
			const requiredFields = {
				accounts: [config.eosNetwork]
			}
			var from = this.account.name;
			var to = config.gameContract;
			var amount = parseFloat(0.0001).toFixed(4) + ' ' + config.mainToken;
			var memo = this.invitation;
			var arg = [from, to, amount, memo]
			this.scatterEosClient.contract(config.tokenContract, { requiredFields }).then(contract => {
				contract.transfer(...arg).then(tx => {
					this.$notify({
						title: '通知',
						message: '邀请成功',
						offset: 100
					});
					this.refresh();
				}).catch(e => {
					if(typeof e.code === 'undefined'){
						this.$message({
							type: 'info',
							message: '请先登陆scatter钱包！'
						}); 
					} else if(e.code == 402) {
						this.$message({
							type: 'info',
							message: '已取消！'
						}); 
					}  
				})
			}).catch(e => {
				if(e == {}){
					this.$message({
						type: 'info',
						message: '请先登陆scatter钱包！'
					}); 
				} else if(e.code == 402) {
					this.$message({
						type: 'info',
						message: '已取消！'
					}); 
				}
					
			});
		},
		stake() {
			const requiredFields = {
				accounts: [config.eosNetwork]
			}
			// hard code
			var from = this.account.name;
			var to = config.gameContract;
			var amount = parseFloat(this.stakeAmount).toFixed(4) + ' ' + config.gameToken; 
			var memo = "stake";
			var arg = [from, to, amount, memo]
			this.scatterEosClient.contract(config.gameTokenContract, { requiredFields }).then(contract => {
				contract.transfer(...arg).then(tx => {
					this.$notify({
						title: '通知',
						message: '抵押成功',
						offset: 100
					});
					this.refresh();
				}).catch(e => {
					console.log(e)
				})
			}).catch(e => {
				console.log(e)
			});
		},
		unstake() {
			const requiredFields = {
				accounts: [config.eosNetwork]
			}
			// hard code
			var from = this.account.name;
			var to = config.gameContract;
			var amount = "0.0003 " + config.mainToken;
			var memo = "通过向合约转账0.0003EOS解除抵押";
			var arg = [from, to, amount, memo]
			this.scatterEosClient.contract(config.tokenContract, { requiredFields }).then(contract => {
				contract.transfer(...arg).then(tx => {
					this.$notify({
						title: '通知',
						message: '已取消抵押',
						offset: 100
					});
					this.refresh();
				}).catch(e => {
					console.log(e)
				})
			}).catch(e => {
				console.log(e)
			});
		},
		collect_fee() {
			const requiredFields = {
				accounts: [config.eosNetwork]
			}
			// hard code
			var from = this.account.name;
			var to = config.gameContract;
			var amount = "0.0001 " + config.mainToken;
			var memo = "通过向合约转账0.0001EOS领取邀请人奖励";
			var arg = [from, to, amount, memo]
			this.scatterEosClient.contract(config.tokenContract, { requiredFields }).then(contract => {
				contract.transfer(...arg).then(tx => {
					this.$notify({
						title: '通知',
						message: '领取成功',
						offset: 100
					});
					this.refresh();
				}).catch(e => {
					console.log(e)
				})
			}).catch(e => {
				console.log(e)
			});
		},
		collect_reward() {
			const requiredFields = {
				accounts: [config.eosNetwork]
			}
			// hard code
			var from = this.account.name;
			var to = config.gameContract;
			var amount = "0.0002 " + config.mainToken;
			var memo = "通过向合约转账0.0002EOS领取头号奖励";
			var arg = [from, to, amount, memo]
			this.scatterEosClient.contract(config.tokenContract, { requiredFields }).then(contract => {
				contract.transfer(...arg).then(tx => {
					this.$notify({
						title: '通知',
						message: '领取成功',
						offset: 100
					});
					this.refresh();
				}).catch(e => {
					console.log(e)
				})
			}).catch(e => {
				console.log(e)
			});
		},
		handleClick(tab, event) {
		},
		handleChange(value) {
      	}
	},

	mounted(){
		this.getGame();
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
