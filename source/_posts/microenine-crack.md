---
title: 记录一次微擎的云检测破解之道
date: 2016-04-28 16:50:55
tags: 
- 微擎
- php
- 二次开发
categories: 
- 二次开发
---

其实做为开发人员，我们都应该尊重别人的劳动成果的，但互联网的免费性，开源性，分享性，而更多的是码农的穷逼性，不知是被逼使用一些盗版软件，破解一些东西什么的。
<!--more-->
以前手头上微信框架用的是某X力的，虽然知道也是破解的微擎的，但人家便宜呀，模块多呀。

不过真的是一分钱一分货，bug太多，更新不行，以至后来我升级到他们的新版本后根本就不能更新了。

最后想了想，还是和微擎吧，毕竟是官方的，而且免费更新框架，至少框架这一块是稳定了。

但用免费版的微擎有一个比较大的问题就是，很多模块都是要收费的，这样可免费用的模块就比较少了。

网上会有很多微擎的模块盗版出来的，但安装会有一个问题就是，微擎的模块都是在线安装的，就算我们拿到模块进行本地安装时，也会通过模块名进行云检测，如果商城中有这个模块，就会提示盗版，而站点就可能会被记录黑名单，这样就不能再使用微擎的一切云服务了，比如安装微擎商城中的模块，更新框架等。

网上主流的解决方法就是屏蔽云服务，但是这样所有模块就只能本地安装了，框架也不能更新了。

我希望能够得到完美的解决方案就是，我能够正常使用微擎的免费服务，包括更新框架，安装商城免费的模块，更新商城的免费模块，同时，我也可以安装自己盗版的模块。

通过分析微擎云服务文件，弄清楚了每个函数的用途，最后终于完美解决了我的问题，达到了我上面想要的效果。当然，具体解决方法就不公布了，毕竟这是一个不友好的行为。在此只是记录一下解决思路：让云服务不知道你安装了哪些盗版的模块。

现在的效果就是这样的：
![](http://7te946.com1.z0.glb.clouddn.com/16-4-28/62063731.jpg)

人人商城肯定是盗版的，而微商城是正常从商城里面安装的，后期也是可以免费升级的。

![](http://7te946.com1.z0.glb.clouddn.com/16-4-28/91641646.jpg)
一键更新，毫无影响。

分享一份自己备注的微擎cloud.mod.php函数

```php
<?php
/**
 * [WeEngine System] Copyright (c) 2014 WE7.CC
 * WeEngine is NOT a free software, it under the license terms, visited http://www.we7.cc/ for more details.
 */
defined('IN_IA') or exit('Access Denied');

function cloud_client_define() {
	return array(
		'/framework/function/communication.func.php',
		'/framework/model/cloud.mod.php',
		'/web/source/cloud/upgrade.ctrl.php',
		'/web/source/cloud/process.ctrl.php',
		'/web/source/cloud/dock.ctrl.php',
		'/web/themes/default/cloud/upgrade.html',
		'/web/themes/default/cloud/process.html'
	);
}


function cloud_prepare() {
	global $_W;
	setting_load();
	if(empty($_W['setting']['site']['key']) || empty($_W['setting']['site']['token'])) {
		return error('-1', "您的程序需要在微擎云服务平台注册你的站点资料, 来接入云平台服务后才能使用相应功能.");
	}
	return true;
}

function cloud_m_prepare($name) {//模块验证 传入模块名字，通过云平台验证是否受版权保护 仅用于模块安装 批量安装模块的时候使用
	$pars['method'] = 'module.check';
	$pars['module'] = $name;
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	if (is_error($dat)) {
		return $dat;
	}
	if ($dat['content'] == 'install-module-protect') {
		return error('-1', '此模块已设置版权保护，您只能通过云平台来安装。');
	}
	return true;
}

function _cloud_build_params() {//云服务变量数组
	global $_W;
	$pars = array();
	$pars['host'] = $_SERVER['HTTP_HOST'];
	$pars['family'] = IMS_FAMILY;
	$pars['version'] = IMS_VERSION;
	$pars['release'] = IMS_RELEASE_DATE;
	$pars['key'] = $_W['setting']['site']['key'];
	$pars['password'] = md5($_W['setting']['site']['key'] . $_W['setting']['site']['token']);
	$clients = cloud_client_define();
	$string = '';
	foreach($clients as $cli) {
		$string .= md5_file(IA_ROOT . $cli);
	}
	$pars['client'] = md5($string);
	return $pars;
}


function cloud_m_build($modulename, $type = '') {//云平台安装 卸载模块 更新模块
	$type = in_array($type, array('uninstall')) ? $type : '';
	$sql = 'SELECT * FROM ' . tablename('modules') . ' WHERE `name`=:name';
	$module = pdo_fetch($sql, array(':name' => $modulename));
	$pars = _cloud_build_params();
	$pars['method'] = 'module.build';
	$pars['module'] = $modulename;
	$pars['type'] = $type;
	if (!empty($module)) {
		$pars['module_version'] = $module['version'];
	}

		$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	$file = IA_ROOT . '/data/module.build';
	$ret = _cloud_shipping_parse($dat, $file);//云服务结果处理

	if (!is_error($ret)) {
		$dir = IA_ROOT . '/addons/' . $modulename;
		$files = array();
		if (!empty($ret['files'])) {
			foreach ($ret['files'] as $file) {
				$entry = $dir . $file['path'];
				if (!is_file($entry) || md5_file($entry) != $file['checksum']) {
					$files[] = '/' . $modulename . $file['path'];
				}
			}
		}
		$ret['files'] = $files;
		$schemas = array();
		if (!empty($ret['schemas'])) {
			load()->func('db');
			foreach ($ret['schemas'] as $remote) {
				$name = substr($remote['tablename'], 4);
				$local = db_table_schema(pdo(), $name);
				unset($remote['increment']);
				unset($local['increment']);
				if (empty($local)) {
					$schemas[] = $remote;
				} else {
					$diffs = db_table_fix_sql($local, $remote);
					if (!empty($diffs)) {
						$schemas[] = $remote;
					}
				}
			}
		}
		$ret['upgrade'] = true;
		$ret['type'] = 'module';
		$ret['schemas'] = $schemas;
				if (empty($module)) {
			$ret['install'] = 1;
		}
	}
	return $ret;
}


function cloud_m_query() {//非系统模块发送到服务端 a=module&do=check 已经安装模块 检查更新 安装模块 检查已经购买但没有安装的
	$pars = _cloud_build_params();
	$pars['method'] = 'module.query';
	$pars['module'] = cloud_extra_module();//获取非系统模块
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	$file = IA_ROOT . '/data/module.query';
	$ret = _cloud_shipping_parse($dat, $file);
	return $ret;
}

function cloud_m_info($name) {//获取指定模块信息 安装模块 更新模块时进行检查
	$pars = _cloud_build_params();
	$pars['method'] = 'module.info';
	$pars['module'] = $name;
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	$file = IA_ROOT . '/data/module.info';
	$ret = _cloud_shipping_parse($dat, $file);
	return $ret;
}


function cloud_m_upgradeinfo($name) {//在线检测模块更新 仅用于module.ctrl.php 469 $do == 'upgrade' 参数 传入模块名
	$module = pdo_fetch("SELECT name, version FROM ".tablename('modules')." WHERE name = '{$name}'");
	$pars = _cloud_build_params();
	$pars['method'] = 'module.info';
	$pars['module'] = $name;
	$pars['curversion'] = $module['version'];
	$pars['isupgrade'] = 1;
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	$file = IA_ROOT . '/data/module.info';
	$ret = _cloud_shipping_parse($dat, $file);
	return $ret;
}

function cloud_t_prepare($name) {//模板云检测
	$pars['method'] = 'theme.check';
	$pars['theme'] = $name;
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	if (is_error($dat)) {
		return $dat;
	}
	if ($dat['content'] == 'install-theme-protect') {
		return error('-1', '此模板已设置版权保护，您只能通过云平台来安装。');
	}
	return true;
}


function cloud_t_query() {//获取在线安装的模板
	$pars = _cloud_build_params();
	$pars['method'] = 'theme.query';
	$pars['theme'] = cloud_extra_theme();
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	$file = IA_ROOT . '/data/theme.query';
	$ret = _cloud_shipping_parse($dat, $file);
	return $ret;
}

function cloud_t_info($name) {//在线获取指定模板信息
	$pars = _cloud_build_params();
	$pars['method'] = 'theme.info';
	$pars['theme'] = $name;
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	$file = IA_ROOT . '/data/theme.info';
	$ret = _cloud_shipping_parse($dat, $file);
	return $ret;
}

function cloud_t_build($name) {//在线安装模板
	$sql = 'SELECT * FROM ' . tablename('site_templates') . ' WHERE `name`=:name';
	$theme = pdo_fetch($sql, array(':name' => $name));
	
	$pars = _cloud_build_params();
	$pars['method'] = 'theme.build';
	$pars['theme'] = $name;
	if(!empty($theme)) {
		$pars['themeversion'] = $theme['version'];
	}
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	$file = IA_ROOT . '/data/theme.build';
	$ret = _cloud_shipping_parse($dat, $file);
	if(!is_error($ret)) {
		$dir = IA_ROOT . '/app/themes/' . $name;
		$files = array();
		if(!empty($ret['files'])) {
			foreach($ret['files'] as $file) {
				$entry = $dir . $file['path'];
				if(!is_file($entry) || md5_file($entry) != $file['checksum']) {
					$files[] = '/'. $name . $file['path'];
				}
			}
		}
		$ret['files'] = $files;
		$ret['upgrade'] = true;
		$ret['type'] = 'theme';
				if(empty($theme)) {
			$ret['install'] = 1;
		}
	}
	return $ret;
}


function cloud_t_upgradeinfo($name) {//在线获取模板更新
	$sql = 'SELECT `name`, `version` FROM ' . tablename('site_templates') . ' WHERE `name` = :name';
	$theme = pdo_fetch($sql, array(':name' => $name));
	$pars = _cloud_build_params();
	$pars['method'] = 'theme.upgrade';
	$pars['theme'] = $theme['name'];
	$pars['version'] = $theme['version'];
	$pars['isupgrade'] = 1;
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	$file = IA_ROOT . '/data/module.info';
	$ret = _cloud_shipping_parse($dat, $file);
	return $ret;
}

function cloud_sms_send($mobile, $content) {//在线短信接口
	global $_W;
	$log = array(
		'mobile' => $mobile,
		'content' => $content,
		'result' => '',
		'uniacid' => $_W['uniacid'],
		'createtime' => TIMESTAMP
	);
	$row = pdo_get('uni_settings' , array('uniacid' => $_W['uniacid']), array('notify'));
	$row['notify'] = @iunserializer($row['notify']);
	if(!empty($row['notify']) && !empty($row['notify']['sms'])) {
		$config = $row['notify']['sms'];
		$balance = intval($config['balance']);
		if($balance <= 0) {
			$log['result'] = '发送短信失败, 请联系系统管理人员. 错误详情: 短信余额不足';
			pdo_insert('core_sendsms_log', $log);
			return error(-1, $log['result']);
		}
		$sign = $config['signature'];
		if(empty($sign) && IMS_FAMILY == 'x') {
			$sign = $_W['setting']['copyright']['sitename'];
		}
		if(empty($sign)) {
			$sign = '微擎';
		}
		$log['content'] = $content . " 【{$sign}】";

		$pars = _cloud_build_params();
		$pars['method'] = 'sms.send';
		$pars['mobile'] = $mobile;
		$pars['content'] = $content . " 【{$sign}】";
		$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
		$file = IA_ROOT . '/data/sms.send';
		$ret = _cloud_shipping_parse($dat, $file);
		if (is_error($ret)) {
			$log['result'] = $ret['message'];
			pdo_insert('core_sendsms_log', $log);
			return error($ret['errno'], $ret['message']);
		}
		if ($ret == 'success') {
			return true;
		} else {
			$log['result'] = $ret['message'];
			pdo_insert('core_sendsms_log', $log);
			return error(-1, $ret);
		}
	}
	pdo_insert('core_sendsms_log', $log);
	return error(-1, '发送短信失败, 请联系系统管理人员. 错误详情: 没有设置短信配额或参数');
}

function cloud_build() {//程序更新入口
	$pars = _cloud_build_params();
	$pars['method'] = 'application.build';
	$pars['extra'] = cloud_extra_account();
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	$file = IA_ROOT . '/data/application.build';
	$ret = _cloud_shipping_parse($dat, $file);
	if(!is_error($ret)) {
		if($ret['state'] == 'warning') {
			$ret['files'] = cloud_client_define();
			unset($ret['schemas']);
			unset($ret['scripts']);
		} else {
			$files = array();
			if(!empty($ret['files'])) {
				foreach($ret['files'] as $file) {
					$entry = IA_ROOT . $file['path'];
					if(!is_file($entry) || md5_file($entry) != $file['checksum']) {
						$files[] = $file['path'];
					}
				}
			}
			$ret['files'] = $files;

			$schemas = array();
			if(!empty($ret['schemas'])) {
				load()->func('db');
				foreach($ret['schemas'] as $remote) {
					$name = substr($remote['tablename'], 4);
					$local = db_table_schema(pdo(), $name);
					unset($remote['increment']);
					unset($local['increment']);
					if(empty($local)) {
						$schemas[] = $remote;
					} else {
						$sqls = db_table_fix_sql($local, $remote);
						if(!empty($sqls)) {
							$schemas[] = $remote;
						}
					}
				}
			}
			$ret['schemas'] = $schemas;
		}

		if($ret['family'] == 'x' && IMS_FAMILY == 'v') {
			load()->model('setting');
			setting_upgrade_version('x', IMS_VERSION, IMS_RELEASE_DATE);
			message('您已经购买了商业授权版本, 系统将转换为商业版, 并重新运行自动更新程序.', 'refresh');
		}
		$ret['upgrade'] = false;
		if(!empty($ret['files']) || !empty($ret['schemas']) || !empty($ret['scripts'])) {
			$ret['upgrade'] = true;
		}
		$upgrade = array();
		$upgrade['upgrade'] = $ret['upgrade'];
		$upgrade['lastupdate'] = TIMESTAMP;
		cache_write('upgrade', $upgrade);
	}
	return $ret;
}

function cloud_schema() {//数据库整理
	$pars = _cloud_build_params();
	$pars['method'] = 'application.schema';
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	$file = IA_ROOT . '/data/application.schema';
	$ret = _cloud_shipping_parse($dat, $file);
	if(!is_error($ret)) {
		$schemas = array();
		if(!empty($ret['schemas'])) {
			load()->func('db');
			foreach($ret['schemas'] as $remote) {
				$name = substr($remote['tablename'], 4);
				$local = db_table_schema(pdo(), $name);
				unset($remote['increment']);
				unset($local['increment']);
				if(empty($local)) {
					$schemas[] = $remote;
				} else {
					$diffs = db_schema_compare($local, $remote);
					if(!empty($diffs)) {
						$schemas[] = $remote;
					}
				}
			}
		}
		$ret['schemas'] = $schemas;
	}
	return $ret;
}

function cloud_download($path, $type = '') {//下载文件
	$pars = _cloud_build_params();
	$pars['method'] = 'application.shipping';
	$pars['path'] = $path;
	$pars['type'] = $type;
	$pars['gz'] = function_exists('gzcompress') && function_exists('gzuncompress') ? 'true' : 'false';
	$headers = array('content-type' => 'application/x-www-form-urlencoded');
	$dat = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars, $headers, 300);
	if(is_error($dat)) {
		return error(-1, '网络存在错误， 请稍后重试。' . $dat['message']);
	}
	if($dat['content'] == 'success') {
		return true;
	}
	$ret = @json_decode($dat['content'], true);
	if(is_error($ret)) {
		return $ret;
	} else {
		return error(-1, '不能下载文件， 请稍后重试。');
	}
}

function _cloud_shipping_parse($dat, $file) {//云服务结果处理
	if (is_error($dat)) {
		return error(-1, '网络传输错误, 请检查您的cURL是否可用, 或者服务器网络是否正常. ' . $dat['message']);
	}
	$tmp = unserialize($dat['content']);
	if (is_array($tmp) && is_error($tmp)) {
		if ($tmp['errno'] == '-2') {
			$data = file_get_contents(IA_ROOT . '/framework/version.inc.php');
			file_put_contents(IA_ROOT . '/framework/version.inc.php', str_replace("'x'", "'v'", $data));
		}
		return $tmp;
	}
	if ($dat['content'] == 'patching') {
		return error(-1, '补丁程序正在更新中，请稍后再试！');
	}
	if ($dat['content'] == 'blacklist') {
		return error(-1, '抱歉，您的站点已被列入云服务黑名单，云服务一切业务已被禁止，请联系微擎客服！');
	}
	if (strlen($dat['content']) != 32) {
		return error(-1, '云服务平台向您的服务器传输数据过程中出现错误, 这个错误可能是由于您的通信密钥和云服务不一致, 请尝试诊断云服务参数(重置站点ID和通信密钥). 传输原始数据:' . $dat['meta']);
	}
	$data = @file_get_contents($file);
	if (empty($data)) {
		return error(-1, '没有接收到服务器的传输的数据.');
	}
	@unlink($file);
	$ret = @iunserializer($data);
	if (empty($data) || empty($ret) || $dat['content'] != $ret['secret']) {
		return error(-1, '云服务平台向您的服务器传输的数据校验失败, 可能是因为您的网络不稳定, 或网络不安全, 请稍后重试.');
	}
	$ret = iunserializer($ret['data']);
	if (is_array($ret) && is_error($ret)) {
		if ($ret['errno'] == '-2') {
			$data = file_get_contents(IA_ROOT . '/framework/version.inc.php');
			file_put_contents(IA_ROOT . '/framework/version.inc.php', str_replace("'x'", "'v'", $data));
		}
	}
	if (!is_error($ret) && is_array($ret) && !empty($ret)) {
		if ($ret['state'] == 'fatal') {
			return error($ret['errorno'], '发生错误: ' . $ret['message']);
		}
		return $ret;
	} else {
		return error($ret['errno'], "发生错误: {$ret['message']}");
	}
}

function cloud_request($url, $post = '', $extra = array(), $timeout = 60) {//发送云服务请求
	global $_W;
	load()->func('communication');
	if (!empty($_W['setting']['cloudip']['ip']) && empty($extra['ip'])) {
		$extra['ip'] = $_W['setting']['cloudip']['ip'];
	}
	return ihttp_request($url, $post, $extra, $timeout);
}


function cloud_extra_account() {//获取添加公众号信息
	$data = array();
	$data['accounts'] = pdo_fetchall("SELECT name, account, original FROM ".tablename('account_wechats') . " GROUP BY account");
	return serialize($data);
}


function cloud_extra_module() {//获取非系统模块 只用于cloud_m_query()方法
	$sql = 'SELECT `name` FROM ' . tablename('modules') . ' WHERE `type` <> :type';
	$modules = pdo_fetchall($sql, array(':type' => 'system'), 'name');
	if (!empty($modules)) {
		return base64_encode(iserializer(array_keys($modules)));
	} else {
		return '';
	}
}


function cloud_extra_theme() {//获取非默认模板 
	$sql = 'SELECT `name` FROM ' . tablename('site_templates') . ' WHERE `name` <> :name';
	$themes = pdo_fetchall($sql, array(':name' => 'default'), 'name');
	if (!empty($themes)) {
		return base64_encode(iserializer(array_keys($themes)));
	} else {
		return '';
	}
}


function cloud_cron_create($cron) {//添加定时任务
	$pars = _cloud_build_params();
	$pars['method'] = 'cron.create';
	$pars['cron'] = base64_encode(iserializer($cron));
	$result = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	return _cloud_cron_parse($result);
}


function cloud_cron_update($cron) {//更新定时任务
	$pars = _cloud_build_params();
	$pars['method'] = 'cron.update';
	$pars['cron'] = base64_encode(iserializer($cron));
	$result = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	return _cloud_cron_parse($result);
}


function cloud_cron_get($cron_id) {//获取定时任务
	$pars = _cloud_build_params();
	$pars['method'] = 'cron.get';
	$pars['cron_id'] = $cron_id;
	$result = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	return _cloud_cron_parse($result);
}


function cloud_cron_change_status($cron_id, $status) {//更改定时任务状态
	$pars = _cloud_build_params();
	$pars['method'] = 'cron.status';
	$pars['cron_id'] = $cron_id;
	$pars['status'] = $status;
	$result = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	return _cloud_cron_parse($result);
}


function cloud_cron_remove($cron_id) {//删除定时任务
	$pars = _cloud_build_params();
	$pars['method'] = 'cron.remove';
	$pars['cron_id'] = $cron_id;
	$result = cloud_request('http://v2.addons.we7.cc/gateway.php', $pars);
	return _cloud_cron_parse($result);
}


function _cloud_cron_parse($result) {//定时任务返回结果处理
	if (empty($result)) {
		return error(-1, '没有接收到服务器的传输的数据');
	}
	if ($result['content'] == 'blacklist') {
		return error(-1, '抱歉，您的站点已被列入云服务黑名单，云服务一切业务已被禁止，请联系微擎客服！');
	}
	$result = json_decode($result['content'], true);
	if (null === $result) {
		return error(-1, '云服务通讯发生错误，请稍后重新尝试！');
	}
	$result = $result['message'];
	if (is_error($result)) {
		return error(-1, $result['message']);
	}
	return $result;
}

function cloud_auth_url($forward, $data = array()){//云端oauth权限
	global $_W;

	$auth = array();
	$auth['key'] = '';
	$auth['password'] = '';
	$auth['url'] = rtrim($_W['siteroot'], '/');
	$auth['referrer'] = intval($_W['config']['setting']['referrer']);
	$auth['version'] = IMS_VERSION;
	$auth['forward'] = $forward;

	if(!empty($_W['setting']['site']['key']) && !empty($_W['setting']['site']['token'])) {
		$auth['key'] = $_W['setting']['site']['key'];
		$auth['password'] = md5($_W['setting']['site']['key'] . $_W['setting']['site']['token']);
	}
	if ($data && is_array($data)) {
		$auth = array_merge($auth, $data);
	}
	$query = base64_encode(json_encode($auth));
	$auth_url = 'http://v2.addons.we7.cc/web/index.php?c=auth&a=passwort&__auth=' . $query;

	return $auth_url;
}


function cloud_module_setting_prepare($module, $binding) {//模块设置
	global $_W;
	$auth = _cloud_build_params();
	$auth['arguments'] = array(
		'binding' => $binding,
		'acid' => $_W['uniacid'],
		'type' => 'module',
		'module' => $module,
	);
	$iframe_auth_url = cloud_auth_url('module', $auth);
	
	return $iframe_auth_url;
}


function cloud_resource_to_local($uniacid, $type, $url){
	global $_W;

	load()->func('file');

	$setting = $_W['setting']['upload'][$type];

	$pathinfo = pathinfo($url);
	$extension = !empty($pathinfo['extension']) ? $pathinfo['extension'] : 'jpg';
	$originname = $pathinfo['basename'];

	$setting['folder'] = "{$type}s/{$uniacid}/".date('Y/m/');

	$originname = pathinfo($url, PATHINFO_BASENAME);
	$filename = file_random_name(ATTACHMENT_ROOT .'/'. $setting['folder'], $extension);
	$pathname = $setting['folder'] . $filename;
	$fullname = ATTACHMENT_ROOT . $pathname;

	mkdirs(dirname($fullname));

	if (file_put_contents($fullname, file_get_contents($url)) == false) {
		return error(1, '提取文件失败');
	}

	if (!empty($_W['setting']['remote']['type'])) {
		$remotestatus = file_remote_upload($pathname);
		if (is_error($remotestatus)) {
			return error(1, '远程附件上传失败，请检查配置并重新上传');
		} else {
			file_delete($pathname);
		}
	}

	$data = array(
		'uniacid' => $uniacid,
		'uid' => intval($_W['uid']),
		'filename' => $originname,
		'attachment' => $pathname,
		'type' => $type == 'image' ? 1 : 2,
		'createtime' => TIMESTAMP,
	);
	pdo_insert('core_attachment', $data);

	$data['url'] = tomedia($pathname);
	$data['id'] = pdo_insertid();

	return $data;
}

```