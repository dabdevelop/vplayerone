<template>
    <div id="eosdapp">
		<!-- 头号玩家合约安全规则说明路线图代码开源免责说明 -->
		<b-navbar toggleable="md" type="light" variant="light">
			<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
			<b-navbar-brand href="#">EOS头号玩家</b-navbar-brand>
			<b-collapse is-nav id="nav_collapse">
				<b-navbar-nav>
					<b-nav-item href="#">游戏规则</b-nav-item>
					<b-nav-item href="#">路线图</b-nav-item>
					<b-nav-item href="#">安全说明</b-nav-item>
					<b-nav-item href="#">免责说明</b-nav-item>
					<b-nav-item href="https://github.com/dabdevelop/playerone/blob/master/playerone/playerone.cpp">合约开源</b-nav-item>
				</b-navbar-nav>
				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-nav-form>
						<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="EOS用户名"/>
						<b-button size="sm" variant="outline-success" class="my-2 my-sm-0" type="submit">搜索</b-button>
					</b-nav-form>
					<b-nav-item-dropdown text="语言" right>
						<b-dropdown-item href="#">ZH</b-dropdown-item>
						<b-dropdown-item href="#">EN</b-dropdown-item>
					</b-nav-item-dropdown>
					<b-nav-item-dropdown right>
						<!-- Using button-content slot -->
						<template slot="button-content">
							<b>用户</b>
						</template>
						<b-dropdown-item @click.prevent="login">登录</b-dropdown-item>
						<b-dropdown-item @click.prevent="logout">注销</b-dropdown-item>
						<b-dropdown-item @click.prevent="collect_fee">领取推荐奖励</b-dropdown-item>
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
								<el-button type="primary" style="float: right;" icon="el-icon-refresh" circle></el-button>
							</div>
							{{game.gameid}}
							{{game.reserve}}
							{{game.insure}}
							{{game.max_supply}}
							{{game.supply}}
							{{game.balance}}
							{{game.circulation}}
							{{game.burn}}
							{{game.staked}}
							{{game.fee}}
							{{game.reward}}
							{{game.next_refer}}
							{{game.player_one}}
							{{game.start_time}}
							{{game.reward_time}}
						</el-card>
					</div>
					<div class="col-12 col-lg-6 col-xl-6">
						<el-card :body-style="{ padding: '10px' }" shadow="hover">
							<div slot="header" class="clearfix">
								<span>用户信息</span>
								<el-button type="primary" style="float: right;" icon="el-icon-refresh" circle></el-button>
							</div>
							{{user.name}}
							{{user.parent}}
							{{user.reward}}
							{{user.last_action}}
							{{user.refer}}
							{{user.invitation}}
							{{user.discount}}
							
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
									<el-button @click.prevent="buy" type="primary" plain>购买CGT</el-button>
									<el-button @click.prevent="deposit" type="info" disabled="true" plain>购买推荐码</el-button>
									<el-button @click.prevent="invite" type="info" disabled="true" plain>邀请朋友</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="购买推荐码" name="second">
									<p>请输入EOS数量</p>
									<el-input-number v-model="depositAmount" @change="handleChange" :min="0" :max="100" :precision="2" :step="10" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="buy" type="info" disabled="true" plain>购买CGT</el-button>
									<el-button @click.prevent="deposit" type="primary" plain>购买推荐码</el-button>
									<el-button @click.prevent="invite" type="info" disabled="true" plain>邀请朋友</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="邀请朋友" name="third">
									<p>请输入EOS账号</p>
									<el-input v-model="invitation" placeholder="EOS账号"></el-input>
									<br><br>
									<el-button @click.prevent="buy" type="info" disabled="true" plain>购买CGT</el-button>
									<el-button @click.prevent="deposit" type="info" disabled="true" plain>购买推荐码</el-button>
									<el-button @click.prevent="invite" type="primary" plain>邀请朋友</el-button>
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
									<el-button @click.prevent="sell" type="danger" plain>出售CGT</el-button>
									<el-button @click.prevent="burn" type="info" disabled="true" plain>销毁CGT</el-button>
									<el-button @click.prevent="stake" type="info" disabled="true" plain>抵押CGT</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="销毁CGT" name="second">
									<p>请输入CGT数量</p>
									<el-input-number v-model="burnAmount" @change="handleChange" :min="0" :max="1000000" :step="1000" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="sell" type="info" disabled="true" plain>出售CGT</el-button>
									<el-button @click.prevent="burn" type="danger" plain>销毁CGT</el-button>
									<el-button @click.prevent="stake" type="info" disabled="true" plain>抵押CGT</el-button>
									<br>
								</el-tab-pane>
								<el-tab-pane label="抵押CGT" name="third">
									<p>请输入CGT数量</p>
									<el-input-number v-model="stakeAmount" @change="handleChange" :min="1000" :max="1000000" :step="1000" label="描述文字"></el-input-number>
									<br><br>
									<el-button @click.prevent="sell" type="info" disabled="true" plain>出售CGT</el-button>
									<el-button @click.prevent="burn" type="info" disabled="true" plain>销毁CGT</el-button>
									<el-button @click.prevent="stake" type="danger" plain>抵押CGT</el-button>
									<br>
								</el-tab-pane>
							</el-tabs>
						</el-card>
					</div>
				</div>
			</div>
		</div>

		<br>
		<div>
			<div class="col-12 col-lg-12 col-xl-12">
				<el-card :body-style="{ padding: '10px' }" shadow="hover">
					<h2 style="text-align:center;">游戏规则</h2>
					<br><br>
					<el-collapse v-model="ruleActive" accordion>
						<el-collapse-item title="一致性 Consistency" name="1">
							<div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
							<div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
						</el-collapse-item>
						<el-collapse-item title="反馈 Feedback" name="2">
							<div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
							<div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
						</el-collapse-item>
						<el-collapse-item title="效率 Efficiency" name="3">
							<div>简化流程：设计简洁直观的操作流程；</div>
							<div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
							<div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
						</el-collapse-item>
						<el-collapse-item title="可控 Controllability" name="4">
							<div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
							<div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
						</el-collapse-item>
					</el-collapse>
				</el-card>
			</div>
		</div>

		<br>
		<div>
			<div class="col-12 col-lg-12 col-xl-12">
				<el-card :body-style="{ padding: '10px' }" shadow="hover">
					<h2 style="text-align:center;">路线图</h2>
					<br><br>
					<el-steps :active="1" align-center>
						<el-step title="内测"></el-step>
						<el-step title="ENU公测"></el-step>
						<el-step title="正式上线"></el-step>
						<el-step title="更多游戏"></el-step>
					</el-steps>
				</el-card>
			</div>
		</div>

		<br>
		<div>
			<div class="col-12 col-lg-12 col-xl-12">
				<el-card :body-style="{ padding: '10px' }" shadow="hover">
					<h2 style="text-align:center;">安全说明</h2>
					<br><br>
					<el-collapse v-model="secureActive" accordion>
						<el-collapse-item title="多重签名智能合约" name="1">
							<div>EOS权限体系通过权重（Weight）和阈值（Threshold）来限制合约账户，可以实现多个人共同管理一个账户资金，假设智能合约账户有5个人的公钥，每个公钥的权重为1，权限的总阈值为3，这就表示必须要这5个人中至少3个人签名，才可以转移资金和修改合约代码。</div>
						</el-collapse-item>
						<el-collapse-item title="移交智能合约权限" name="2">
							<div>这种方式也比较安全，我们可以修改合约权限为eosio.prods账户，直接将智能合约权限移交给官方21个节点来控制，未来如果需要转移资金或修改合约，则需要申请节点仲裁。</div>
						</el-collapse-item>
						<el-collapse-item title="设置合约黑洞公钥" name="3">
							<div>这种方式是最接近区块链定义的，我们可以将智能合约权限修改为黑洞公钥，官方在超级节点竞选时临时用过的这个公钥：EOS1111111111111111111111111111111114T1Anm，它的公钥是0值加检验数据生成的，任何人都不知道它的私钥，未来合约也不可能再被转移资金或修改。</div>
						</el-collapse-item>
						<el-collapse-item title="合约信息公开" name="4">
							<div>合约账号：eosioshadows；</div><br>
							<div>合约地址：https://eospark.com/...eosioshadows</div><br>
							<div>开源代码：https://github.com/...eos-shadows</div><br>
						</el-collapse-item>
					</el-collapse>
				</el-card>
			</div>
		</div>
		<br>
		<div>
			<div class="col-12 col-lg-12 col-xl-12">
				<el-card :body-style="{ padding: '10px' }" shadow="hover">
					<h2 style="text-align:center;">免责声明</h2>
					<br><br>
					<el-collapse v-model="secureActive" accordion>
						<el-collapse-item title="多重签名智能合约" name="1">
							<div>EOS权限体系通过权重（Weight）和阈值（Threshold）来限制合约账户，可以实现多个人共同管理一个账户资金，假设智能合约账户有5个人的公钥，每个公钥的权重为1，权限的总阈值为3，这就表示必须要这5个人中至少3个人签名，才可以转移资金和修改合约代码。</div>
						</el-collapse-item>
						<el-collapse-item title="移交智能合约权限" name="2">
							<div>这种方式也比较安全，我们可以修改合约权限为eosio.prods账户，直接将智能合约权限移交给官方21个节点来控制，未来如果需要转移资金或修改合约，则需要申请节点仲裁。</div>
						</el-collapse-item>
						<el-collapse-item title="设置合约黑洞公钥" name="3">
							<div>这种方式是最接近区块链定义的，我们可以将智能合约权限修改为黑洞公钥，官方在超级节点竞选时临时用过的这个公钥：EOS1111111111111111111111111111111114T1Anm，它的公钥是0值加检验数据生成的，任何人都不知道它的私钥，未来合约也不可能再被转移资金或修改。</div>
						</el-collapse-item>
						<el-collapse-item title="合约信息公开" name="4">
							<div>合约账号：eosioshadows；</div><br>
							<div>合约地址：https://eospark.com/...eosioshadows</div><br>
							<div>开源代码：https://github.com/...eos-shadows</div><br>
						</el-collapse-item>
					</el-collapse>
				</el-card>
			</div>
		</div>
		<br>
		<br>
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
			game:{
				gameid: "oneplayerone",
				reserve: "15518.8152 EOS",
				insure: "17927.0637 EOS",
				max_supply: "10000000.0000 CGT",
				supply: "1503761.6000 CGT",
				balance: "400.0000 CGT",
				circulation: "1503361.6000 CGT",
				burn: "51000.0000 CGT",
				staked: "600.0000 CGT",
				fee: "393.2290 EOS",
				reward: "213.6844 EOS",
				next_refer: "playeronefee",
				player_one: "testuseraaaa",
				start_time: 1534582387,
				reward_time: 1534827508
			},

			user:{
				name: "testuseraaai",
				parent: "playeronefee",
				reward: "0.0000 EOS",
				last_action: 1534695451,
				refer: 0,
				invitation: 0,
				discount: 1
			}
  
		}
	},
	created(){
		this.eosClient = EOS(config.eosOptions);
		document.addEventListener('scatterLoaded', scatterExtension => {
			this.scatter = window.scatter;
			this.scatter.requireVersion(3.0);
			this.scatterEosClient = this.scatter.eos(config.eosNetwork, EOS, config.eosOptions, "http");
		})
		this.scatter.getIdentity({
			accounts: [config.eosNetwork]
		}).then(identity => {
			if (identity && identity.accounts.length > 0) {
				this.account = identity.accounts.find(account => account.blockchain === 'eos');
				this.$message({
					message: '用户：' + this.account.name + '登陆成功！',
					type: 'success'
				});
			}
		}).catch(error => {
			this.$message({
					message: '登陆失败！',
					type: 'danger'
			});
		});
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
				this.$message('用户：' + this.account.name + '注销成功！');
			});
		},
		get_height() {
			this.eosClient.getInfo((error, result) => {
				if(!error){
					this.block_height = result.head_block_num;
				}
			})
		},
		buy() {
			const requiredFields = {
				accounts: [config.eosNetwork]
			}
			// hard code
			var from = this.account.name;
			var to = config.gameContract;
			var amount = parseFloat(this.buyAmount).toFixed(4) + ' ' + config.mainToken;
			var memo = "买入CGT，EOS头号玩家感谢您的支持！ 合约地址：oneplayerone 网址：http://eosplayer.one";
			var arg = [from, to, amount, memo]
			this.scatterEosClient.contract(config.tokenContract, { requiredFields }).then(contract => {
				contract.transfer(...arg).then(tx => {
					this.$notify({
						title: '通知',
						message: '购买成功',
						offset: 100
					});
					console.log(tx)
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
			var memo = "卖出CGT，EOS头号玩家感谢您的支持！ 合约地址：oneplayerone 网址：http://eosplayer.one";
			var arg = [from, to, amount, memo]
			this.scatterEosClient.contract(config.gameTokenContract, { requiredFields }).then(contract => {
				contract.transfer(...arg).then(tx => {
					console.log(tx)
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
					console.log(tx)
				}).catch(e => {
					console.log(e)
				})
			}).catch(e => {
				console.log(e)
			});
		},
		deposit() {
			this.$confirm('购买推荐码花费的EOS是不可退回的，是否购买?', '提示', {
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
				this.$message({
					type: 'info',
					message: e
				});          
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
					console.log(tx)
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
					console.log(tx)
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
			var memo = "通过向合约转账0.0001EOS领取推荐人奖励";
			var arg = [from, to, amount, memo]
			this.scatterEosClient.contract(config.tokenContract, { requiredFields }).then(contract => {
				contract.transfer(...arg).then(tx => {
					console.log(tx)
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
					console.log(tx)
				}).catch(e => {
					console.log(e)
				})
			}).catch(e => {
				console.log(e)
			});
		},
		get_global() {
			this.eosClient.getTableRows({
				json: "true",
				code: config.gameContract,
				scope: config.gameContract,
				table: 'game',
				limit: 1,
				lower_bound: 0
			}).then((data) => {
				console.log(data);
				if (data.rows && data.rows.length > 0) {
					this.global = data.rows[0];
				}
			}).catch((e) => {
				console.error(e);
			})
		},
		handleClick(tab, event) {
        	console.log(tab, event);
		},
		handleChange(value) {
        	console.log(value);
      	}
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
