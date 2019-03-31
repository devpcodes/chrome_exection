import React, { Component } from 'react';
import axios from '../../utils/axios';
import { Tree, Icon, Button, Form, Input, Spin, message, Switch, Tabs, Tooltip } from 'antd';
import filterTree from './filterTree';
import uuid from '../../utils/uuid';
import './default.scss'

const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;
class Default extends Component {
    menu = [];
    selectData = {};
    menu_id = '';
    permission = 'public';
    inputInfo = {}
    setOK = false;
    url = 'https://hackmd.io/9QjNSr4BQ6-qy3wu6SvP5A'
    state = {
        menuTreeNode: [],
        canSave: true,
        selectStructure: [],
        loading: true,
        activeKey: '1',
        btnDisabled: false,
        checkUrl: false,
        url: ''
    }
    render(){
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
        return(
            <div className="default__box">
                {this.state.checkUrl ?
                    <Tooltip placement={'bottom'} autoAdjustOverflow={true} title="已收納">
                        <Icon className="checkUrl" type="check-circle" theme="outlined" style={{ color: '#1bc3de' }} />
                    </Tooltip>
                    : null
                }
                <h1>SAVE NOTES</h1>
                <Tabs onChange={this.changeTab} defaultActiveKey="1">
                    <TabPane tab="收藏網站" key="1">
                            {this.state.activeKey === '1' ? (
                                <Form layout="inline">
                                    <Form.Item>
                                        {getFieldDecorator('webName', {
                                            initialValue: this.inputInfo.webName,
                                            rules: [{ required: true, message: '請輸入收藏名稱' }],
                                        })(
                                            <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="請輸入名稱" />
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('webUrl', {
                                            initialValue: this.inputInfo.webUrl,
                                            rules: [{ required: true, message: '請輸入收藏網址' }],
                                        })(
                                            <Input prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="請輸入網址" />
                                        )}
                                    </Form.Item>
                                </Form>
                            ): (
                                <div></div>
                            )}
                    </TabPane>
                    <TabPane tab="新增資料夾" key="2">
                        <Form layout="inline">
                            {this.state.activeKey === '2' ?(
                                <Form.Item>
                                    {getFieldDecorator('folderName', {
                                        rules: [{ required: true, message: '請輸入資料夾名稱' }],
                                    })(
                                        <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="請輸入名稱" />
                                    )}
                                </Form.Item>
                            ): (
                                <Form.Item>
                                    <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="請輸入名稱" />
                                </Form.Item>
                            )}
                        </Form>
                    </TabPane>
                </Tabs>
 
                <div className="backRoot">
                    <a onClick={this.rootClickHandler}>+ 至根目錄</a>
                </div>
                <Spin
                    spinning={this.state.loading}
                >
                    <div className="menu__box">
                        <Tree
                                showIcon
                                selectedKeys={this.state.selectStructure}
                                onSelect={this.selectHandler}
                            >
                            { this.state.menuTreeNode }
                        </Tree>
                    </div>
                </Spin>
                <div className="permission">
                    <span className="permission__text">瀏覽權限</span>
                    <Switch onChange={this.permissionChange} checkedChildren="公開" unCheckedChildren="隱藏" defaultChecked />
                </div>
                <div className="btn__box">
                    {
                        this.state.canSave ? (
                            <Button disabled={this.state.btnDisabled} icon="select" onClick={this.saveHandler}>確認收藏</Button>
                        ): (
                            <Button icon="select" disabled>確認</Button>
                        )
                    }
                    <Button icon="home" onClick={this.goWebHandler}>前往NOTE</Button>
                </div>
            </div>
        )
    }
    async componentDidMount(){
        var self = this;
        if(process.env.NODE_ENV !== 'development'){
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                let url = tabs[0].url;
                let title = tabs[0].title;
                // console.log('tabs',tabs);
                self.props.form.setFieldsValue({
                    webUrl: url,
                    webName: title
                })
                setTimeout(() => {
                    self.check(url) 
                }, 300);
                
                // this.setState({url})
            })
        }
        // console.log('props',this.props.userName);
    }
    check = async (url) => {
        console.log('props',this.props.userName);
        const result = await axios.get(`/api/menu/${this.props.userName}/checkUrl?url=${url}`)
        if(result.data.msg === 'true'){
            this.setState({
                checkUrl: true
            })
        }
        console.log('result',this.state.url);
    }
    async componentWillReceiveProps(nextProps){
        const res = await axios.get(`/api/extensionMenu/${nextProps.userName}`)
        console.log('res name',nextProps.userName);

        if(res.data){
            if(typeof res.data.items !== 'undefined'){
                console.log('res.data',res.data);
                this.menu_id = res.data.items[0].menu_id;
                if(res.data.items[0].menu){
                    // console.log('res.data.items[0].menu',res.data.items[0].menu);
                    this.menu = res.data.items[0].menu;
                    var menuTreeNode = this.renderMenu(res.data.items[0].menu);
                    this.setState({
                        menuTreeNode
                    })
                    setTimeout(() => {
                        this.setState({loading: false})
                    }, 500);
                    console.log('loadin true');
                }
            }
        }
    }
    renderMenu = (data) => {
		return data.map((item)=>{
			if(item.children){
				if(item.permission == 'public'){
					return(
						// <Icon type="folder" theme="outlined" />
						<TreeNode 
							key={item.structure}
							title={item.name}
							icon={<Icon type="folder" theme="filled" />}
							icon={({expanded}) => {
								return <Icon type={expanded ? 'folder-open' : 'folder'}  theme="filled"/>
							}}
						>
							{this.renderMenu(item.children)} 
						</TreeNode> 
					)
				}else{
					return(
						<TreeNode 
							key={item.structure}
							title={item.name}
							icon={<Icon type="folder" theme="outlined" />}
							icon={({expanded}) => {
								if(expanded){
									return <Icon type={'folder-open'}  theme="outlined"/>
								}else{
									return <span
											className="iconfont"
											style={{
												fontWeight: 600
											}}
										>&#xe6cf;</span>
								}
								// return <Icon type={expanded ? 'folder-open' : 'folder'}  theme="outlined"/>
							}}
						>
							{this.renderMenu(item.children)} 
						</TreeNode> 
					)
				}
			}
			if(item.permission === 'public'){
				return (
					<TreeNode 
						key={item.structure}
						title={item.name}
						icon={<Icon type="file-text" theme="outlined" />}
					>
					</TreeNode>
				)
			}else{
				return (
					<TreeNode 
						key={item.structure}
						title={item.name}
						icon={<span 
								className="iconfont"
								style={{
									fontWeight: 600
								}}
							>&#xe615;</span>}
						// icon={<Icon type="file-excel" theme="outlined" />}
					>
					</TreeNode>
				)
			}

		})
    }
    selectHandler = (selectedKeys, {selected, selectedNodes, node, event}) => {
        // console.log('selectedkeys',selectedKeys);
        this.selectData  = filterTree(selectedKeys[0], this.menu);
        
        if(typeof this.selectData.children !== 'undefined'){
            // console.log('length',this.selectData.children.length);
            // this.selectStructure = data.structure;
            this.setState({
                selectStructure: [this.selectData.structure],
                canSave: true
            })
        }else{
            this.setState({
                selectStructure: [this.selectData.structure],
                canSave: false
            })
        }
        // console.log('select data',this.selectData);
    }
    rootClickHandler = (e) => {
        e.preventDefault();
        this.selectData = {};
        this.setState({
            canSave: true,
            selectStructure: []
        })
    }
    saveHandler = () => {
        if(this.state.loading){
            return;
        }
        this.props.form.validateFields(async (err) => {
            if(err){
                return;
            }
            let inputInfo = this.props.form.getFieldsValue();
            if(this.state.activeKey === '1'){
                const newStructure = this.strucHandler();
                // console.log('newStructure web',newStructure);
                const newPage = {};
                newPage.structure = newStructure;
                newPage.name = inputInfo.webName;
                newPage.url = inputInfo.webUrl;
                newPage.link = 'web';
                newPage.path = `/${this.props.userName}/${uuid()}`;
                newPage.permission = this.permission;
                const menu = this.setData(this.menu, this.selectData.structure, newPage);
                this.pushNewMenu(menu, newPage);
                // console.log('input',inputInfo, newStructure, menu);
            }else{
                const newStructure = this.strucHandler();
                // console.log('newStructure folder',newStructure);
                const newPage = {};
                newPage.structure = newStructure;
                newPage.name = inputInfo.folderName;
                newPage.permission = this.permission;
                newPage.children = [];
                const menu = this.setData(this.menu, this.selectData.structure, newPage);
                this.pushNewMenu(menu, newPage);
                // console.log('input',inputInfo, newStructure, menu);
            }

        })
    }
    strucHandler = () => {
        const data = this.selectData;
        if(typeof data.children !== 'undefined'){
            if(data.children.length != 0){
                var structure = data.children[data.children.length-1].structure;
                structure = structure.split('-');
                structure = structure[structure.length - 1];
                structure = `${data.structure}-${parseInt(structure) + 1}`;
                return structure;
            }else{
                let structure = `${data.structure}-0`;
                return structure;
            }
        }else{
            let structure;
            const arr = this.menu;
            if(arr.length > 0){
                structure = `0-${arr.length}`
            }else{
                structure = '0-0'
            }
            // console.log('structure',structure);
            return structure;
        }
    }
    pushNewMenu = async (menu, newPage) => {
        this.setState({
            loading: true,
            btnDisabled: true
        })
        const menu_id = this.menu_id;
        try {
            const res = await axios.put(`/api/menu/${menu_id}`,{menu_id,menu});
            //爬蟲
            axios.post('/api/queue',{
                menu: menu_id,
                path: newPage.path,
                permission: newPage.permission,
                url: newPage.url
            })
            console.log('axios res',res.data.items);
            if(res.data.items.length > 0){
                this.menu = res.data.items;
                // console.log('selectKey',this.state.selectStructure[0]);
                if(typeof this.state.selectStructure[0] === 'undefined'){
                    this.selectData = {}
                }else{
                    this.selectData  = filterTree(this.state.selectStructure[0], this.menu);
                }
                console.log('render again')
                var menuTreeNode = this.renderMenu(res.data.items);
                this.setState({
                    menuTreeNode,
                    btnDisabled: false,
                    checkUrl: true
                    //loading: false
                })
                this.props.form.resetFields();
                message.success('收藏成功', 5);
            }else{
                this.setState({
                    loading: true
                })
                message.success('收藏成功...', 5);
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }
        } catch (error) {
            this.setState({
                loading: true
            })
            message.success('收藏成功...', 5);
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }
    }
    setData = (menu, rightTarget, targetData) => {
        if(typeof rightTarget == 'undefined'){
            menu.push(targetData);
        }
        if(menu.length != 0){
            this.dataLoop(menu, rightTarget, targetData, false)
        }else{
            menu.push(targetData);
        }
        return menu;
    }
    dataLoop = (menu, rightTarget, targetData) => {
        for(let i = 0; i < menu.length; i++){
            //如果找到點選的資料夾，則在他的children加入新資料
            if (menu[i].structure == rightTarget){
                if(menu[i].children){
                    menu[i].children.push(targetData);
                    break;
                }else{
                    continue;
                }
            }else{
                //否則，如果這個資料夾有children的話，則繼續遞回
                if (typeof menu[i].children != 'undefined') {
                    this.dataLoop(menu[i].children, rightTarget, targetData);
                }else{
                    continue;
                }
            }
        }
    
        return menu;
    }
    permissionChange = (checked) => {
        this.permission = checked ? 'public' : 'private';
    }
    changeTab = (activeKey) => {
        // console.log('activeKey',activeKey);
        if(activeKey === '2'){
            let inputInfo = this.props.form.getFieldsValue();
            this.inputInfo = inputInfo;
            this.setOK = false;
            this.setState({canSave: false})
        }else{
            this.setState({canSave: true})
        }

        this.setState({activeKey})
    }
    goWebHandler = () => {
        var translateUrl = `http://www.mynotemd.com/${this.props.userName}`
        chrome.tabs.create({ url: translateUrl });
    }
};
export default Form.create()(Default);