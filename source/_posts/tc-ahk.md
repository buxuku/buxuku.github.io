title: 利用autohotkey打开TotalCommander并自动点击123
date: 2015-01-17 16:38:46
tags: 
- TotalCommander
categories: 
- 软件
---
根据网上的代码优化而来，可以实现
>快捷打开TotalCommander
>如果已经打开TotalCommander则激活TotalCommander
>如果是未注册版本就自动点击数字1，2，3
>未注册窗口设置为透明
<!-- more -->
实现的代码如下
~~~
#t:: 
IfWinExist ahk_class TTOTAL_CMD
{
	WinActivate
}
else 
{
	Run "c:\totalcmd\TOTALCMD64.EXE"  ;设置为自己TC所在位置 
	WinWait,ahk_class TNASTYNAGSCREEN,,1 ;探测NagPage，若机器慢，1可改为3、4、5 
	If ErrorLevel=0 ;如果有NagPage，需要模拟发送1、2、3 
		{ 
		WinSet,Transparent,0,ahk_class TNASTYNAGSCREEN ;设置NagPage为透明 
		WinActivate,ahk_class TNASTYNAGSCREEN ;抢焦点 
		WinGetText,NagTextStr ;获取NagPage信息并处理 
		StringMid,NagSendChar,NagTextStr,1,1 
		WinActivate,ahk_class TNASTYNAGSCREEN ;再抢焦点 
		Send,%NagSendChar% ;模拟发送1、2、3 
		} 
	WinActivate,ahk_class TTOTAL_CMD 
}
return 
~~~
注：代码中第15行``		StringMid,NagSendChar,NagTextStr,1,1 ``网上的代码最后数字全部设置的为10，1,经过测试，发现都无法运行，最终获取到的是全部的窗口内容，只有设置为1,1才能正确截取到相应的数字。不知道是不是和我的运行环境有关？win7 x64+TotalCommander 8.51a x64