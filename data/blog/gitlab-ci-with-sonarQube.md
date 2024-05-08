---
title: 在 gitlab ci/cd 流程中集成 sonar 进行自动 Code Review
date: 2024-05-06 14:22
tags:
  - 基建
  - sonarQube
---
在团队里面，推行 Code Review 时，一般都会遇到一些阻力，主要有以下几方面： 

- 团队成员需求比较忙，没有精力去进行  Code Review
- 对方的业务逻辑不太熟悉，没办法深入进行 Code Review
- Review 的代码太多，看不过来
- 评审人员的代码能力参差不齐，可能无法给出有效的建议

这就会导致，在团队里面，要不基本不执行 Code Review， 要不就是变成了形式主义。

为了能能够在团队更好地推行 Code Review， 之前我曾过也一个小工具，通过调用 openai 的 api 的方式，来把 MR 里面的代码交给 Ai 来进行 Code Review。但尝试下来，感觉也并不是特别理想，主要体现在

- api 是收费的，如果要进行大量的代码审查，会消耗非常多的 token
- 无法全局理解上下文，只能基于单文件的修改片段进行 Code Review
- 不专业，毕竟 openai 的模型是通用型的模型，并不是专注于代码的模型

后面想到，在代码质量审查这一块，`sonarQube` 在这一块是比较专业的平台了。之前的公司团队也使用过，但在落地上还是没有比较好地推行起来，主要原因可能是研发基本也懒得去 `sonarQube` 上面去看项目的代码质量情况。而且上面看的是整体的或者最近新增的问题，并没有很好地和 CI/CD 流程关联起来。

如果我们把 `sonarQube` 当成代码评审人员，把每次的 MR 的评审结果，以评论的方式提交在 gitlab 上面。那它就真的可以充当代码评审员了，也能够承担起一部分团队内代码评审人员的工作。这样即解放了人力，又能够让研发在提交 MR 时直观地看到自己的代码是否存在问题，以此逐步提升自己的代码水平。

刚好 `sonarQube` 有两个插件

- https://github.com/javamachr/sonar-gitlab-plugin
- https://github.com/mc1arke/sonarqube-community-branch-plugin

第一个插件可以就可以将 `sonarQube` 的审查结果以评论的试发布到 gitlab 上面

第二个插件可以实现增强 `sonarQube` 多分支包括MR的代码检测

结合这两个插件，最终就可以实现如下图的效果

![g4I62q_20240506_aqE3Km](https://static.linxiaodong.com/images/g4I62q_20240506_aqE3Km.png)

并看到对应代码的问题提示

![BkZdsS_20240506_c4GemT](https://static.linxiaodong.com/images/BkZdsS_20240506_c4GemT.png)

研发修改代码之后，重新提交，并重新执行质量的检测，直到检测通过

![gesN2t_20240506_diUQss](https://static.linxiaodong.com/images/gesN2t_20240506_diUQss.png)

本文将以 `gitlab.com` 官方平台， 自有部署 `sonarQube` 的方式简单演示一下实现步骤。实际在公司的内网部署时，可以交给运维来完成整个平台的部署。

对于部署 `sonarQube` ， 我这边选择的是通过 docker 的方式部署的 9.9 LTS 版本

选择 docker 是因为它的依赖比较多， 包括 Java ， PostgreSQL 等。注意官方推荐的 docker 版本是 *20.10* 以上。

选择 9.9 LTS 版本因为它是长期支持版本，以及我在使用 10+ 版本时，运行 sonarqube-community-branch-plugin 插件始终会报错。

这里先准备一份 `docker-compose.yml` 文件，参考内容如下， 这里面主要根据自己的情况，修改一个端口号映射，其它基本上无须修改。

```yml
version: "3"

services:
  sonarqube:
    image: sonarqube:9.9-community
    depends_on:
      - db
    environment:
      SONAR_JDBC_URL: jdbc:postgresql://db:5432/sonar
      SONAR_JDBC_USERNAME: sonar
      SONAR_JDBC_PASSWORD: sonar
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs
      - sonarqube_conf:/opt/sonarqube/conf
    ports:
      - "59000:9000"
  db:
    image: postgres:15.3
    environment:
      POSTGRES_USER: sonar
      POSTGRES_PASSWORD: sonar
    volumes:
      - postgresql:/var/lib/postgresql
      - postgresql_data:/var/lib/postgresql/data

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
  sonarqube_conf:
  postgresql:
  postgresql_data:
```

这里面需要将 `sonarqube_extensions` 挂载出来，以便安装插件。以及 `sonarqube_conf` 挂载出来用于修改 `sonarQube` 的配置文件。

下载 sonar-gitlab-plugin 对应 5.4 版本的 jar 包，放在 `sonarqube_extensions` 目录里面的 `plugins` 目录里面，比如我这里的路径是 `/var/lib/docker/volumes/sonar_sonarqube_extensions/_data/plugins`.

下载 sonarqube-community-branch-plugin 对应 1.14.0 的 jar 包，同样放在这个 plugins 目录里面。

修改 `/var/lib/docker/volumes/sonar_sonarqube_conf/_data` 路径下面的  `sonar.properties` 配置文件:

添加 `sonar.web.javaAdditionalOpts=-javaagent:./extensions/plugins/sonarqube-community-branch-plugin-1.14.0.jar=web`

添加 `sonar.ce.javaAdditionalOpts=-javaagent:./extensions/plugins/sonarqube-community-branch-plugin-1.14.0.jar=ce`

重启 `sonarQube`, 登录 `sonarQube`, 默认账号密码是 admin/admin, 第一次登录会要求修改密码。登录进去之后，会弹出插件风险提示， 点击 *I understand the risk* 即可进入。

![ilIRYF_20240508_EGtKXt](https://static.linxiaodong.com/images/ilIRYF_20240508_EGtKXt.png)

在插件列表里面，即可看到我们安装好的两个插件

![image-20240508145134263](https://static.linxiaodong.com/images/image-20240508145134263_20240508_hSLFET.png)

登录 gitlab.com, 创建一个测试仓库，并在用户设置里面，创建一个个人访问令牌。

![eJaDhE_20240508_l5T8dQ](https://static.linxiaodong.com/images/eJaDhE_20240508_l5T8dQ.png)

登录 sonarQube, 在 project 管理里面即可通过这个个人访问令牌来导入 gitlab 上面来项目。

![pQ5FPu_20240508_tigfcJ](https://static.linxiaodong.com/images/pQ5FPu_20240508_tigfcJ.png)

导入时，我们选择以 gitlab ci 的方式来执行我们的 ci 流程。

![ufEiIB_20240508_VDEvEN](https://static.linxiaodong.com/images/ufEiIB_20240508_VDEvEN.png)


根据提示，在项目中创建 sonar-project.properties， 并粘贴提示内的内容

![OisBOd_20240508_4IICH7](https://static.linxiaodong.com/images/OisBOd_20240508_4IICH7_20240508_mt4ZeY.png)

在gitlab的设置， CI/CD 设置里面，添加环境变量

![image-20240508145819981](https://static.linxiaodong.com/images/image-20240508145819981_20240508_AkjELG.png)

第一个环境变量 `SONAR_TOKEN`，这里需要创建一个 sonarQube 的访问令牌，用于在构建 ci 流程时，有权限访问我们的 sonarQube 服务

![image-20240508144630831](https://static.linxiaodong.com/images/image-20240508144630831_20240508_Te5Qmp.png)

![image-20240508145420554](https://static.linxiaodong.com/images/image-20240508145420554_20240508_Fp2lnA.png)

以及环境变量 `SONAR_HOST_URL` 值为你的 `sonarQube` 平台的访问地址。

在项目里面创建一个 `.gitlab-ci.yml` 文件，并按照提示贴入最小化配置内容

![image-20240508144815113](https://static.linxiaodong.com/images/image-20240508144815113_20240508_wwJsG7.png)

到第4步即算完成

![image-20240508144902813](https://static.linxiaodong.com/images/image-20240508144902813_20240508_YPvGuO.png)



在 sonarQube 的通用配置里面，配置好 base URL， 以方便在 gitlab 的评论里面能够正确连接到 sonarQube 平台上面来。

![image-20240508145042140](https://static.linxiaodong.com/images/image-20240508145042140_20240508_aTx3g5.png)

到此，整个配置就已经完成了，这个时候，就可以去 gitlab 上面刚新建的那个项目，拉个新分支，写一点点测试代码。然后提交一个 MR 合并，就可以看到正常触发 `sonarqube-check` 这个 job 的执行了。并会将执行的结果评论到 MR 上面。就像文章前面的效果一样。

![8BxOcc_20240508_FEWD8y](https://static.linxiaodong.com/images/8BxOcc_20240508_FEWD8y.png)

![image-20240508153829609](https://static.linxiaodong.com/images/image-20240508153829609_20240508_jmB2ih.png)
