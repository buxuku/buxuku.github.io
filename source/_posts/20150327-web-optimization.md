title: 网站前端性能优化
date: 2015-03-27 15:01:58
updated: 2015-03-27 15:01:58
tags:
- web
categories:
- 前端
---
# 一.开启gzip压缩

在linux+Apache环境下开启gzip的方法：
<!-- more -->
### 启用deflate.so模块

```
LoadModule deflate_module modules/mod_deflate.so
```

### 在apache配置文件中增加需要压缩的文件类型

```
<ifmodule mod_deflate.c>
DeflateCompressionLevel 6
AddOutputFilterByType DEFLATE text/plain
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE text/xml
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE text/javascript
AddOutputFilterByType DEFLATE application/xhtml+xml
AddOutputFilterByType DEFLATE application/xml
AddOutputFilterByType DEFLATE application/rss+xml
AddOutputFilterByType DEFLATE application/atom_xml
AddOutputFilterByType DEFLATE application/x-javascript
AddOutputFilterByType DEFLATE application/javascript
AddOutputFilterByType DEFLATE application/x-httpd-php
AddOutputFilterByType DEFLATE image/svg+xml
AddOutputFilterByType DEFLATE application/json
</ifmodule>
```

查看header信息中`request header`

```
Accept:image/webp,*/*;q=0.8
Accept-Encoding:gzip, deflate, sdch
Accept-Language:zh-CN,zh;q=0.8
Cache-Control:no-cache
Connection:keep-alive
Cookie:__cfduid=d5cc4c6799d5826ebe40e22a6ce4c1ff61427275063; tq_current_visit_time=1427423496918; tq_current_source_page_url=http://we.car91.cn/exposure/exposure/index; JSESSIONID=48D7BC57B2BD6868DEDB2AFC646BEB84.jvm1
Host:www.car91.cn
Pragma:no-cache
Referer:http://www.car91.cn/default/index
User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36
```
Accept-Encoding就表示客户端支持的压缩格式

查看header信息中`response header`

```
Accept-Ranges:bytes
Cache-Control:max-age=5356000
Connection:Keep-Alive
Content-Encoding:gzip
Content-Length:32775
Content-Type:application/javascript
Date:Fri, 27 Mar 2015 06:32:19 GMT
ETag:"169d5-5111212ad8b00-gzip"
Keep-Alive:timeout=5, max=94
Last-Modified:Thu, 12 Mar 2015 07:10:04 GMT
Server:Apache/2.4.10 (Unix)
Vary:Accept-Encoding
```
中看到`Content-Encoding:gzip`则表示已经启用了压缩

# 二.设置文件cache

### 开启header模块

```
LoadModule headers_module modules/mod_headers.so
```

###在httpd.conf中添加需要缓存的文件类以及设置时间

```
<FilesMatch ".(flv|gif|jpg|jpeg|png|ico|swf|js|css|pdf|json)$">
Header set Cache-Control "max-age=5356000"
</FilesMatch>

```
设置成功后，如上在response header中就可以看到`Cache-Control:max-age=5356000`的效果了。

# 三.静态资源文件避免cookie

对于静态资源，我们不需要在每次请求中带上cookie信息，对于静态资源避免带上cookie的一个比较简单的方法就是单独用一个域名来保存静态资源，因为不同域的请求不会带上其它域的cookie，比如网站域名是www.abc.com,则可以另外单独用一个static.def.com的域名来保存静态资源。或者单独分配一个static.abc.com来保存，但对于这种二级域名要避免在主域名中存在.abc.com这样作用域的cookie，否则还是会把cookie请求上谨言该主域下面的所有请求上。

# 四.降低首字节响应时间

要降低首字节的响应时间，一个是检查dns解析时间，如果域名的dns解析时间过长，则需要考虑更换域名的dns以提高解析速度。另一个则是优化页面的响应时间了。

# 五.其它的一些常规优化手段

### 1.合并资源，如果js,css文件合并，css sprit

### 2.js全部写在外部js中，并在页面最后加载，尽量采用异步执行的方式

### 3.css全部位于head中

### 4.采用CDN

### 5.开启Keep-Alive

### 6.压缩图片
