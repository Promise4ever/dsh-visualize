# dsh-visualize

![dsh-visualize](assets/social-preview.jpg)

<p align="center">
  <strong>简体中文</strong> | <a href="README.en.md">English</a>
</p>

<p align="center">
  <a href="https://dshfind.com/zh/plugins/Nagi-ovo/dsh-visualize?ref=badge"><img src="https://dshfind.com/api/card/Nagi-ovo/dsh-visualize?lang=zh" alt="dsh-visualize 在 dshfind 插件目录上的展示卡" width="440"></a>
</p>

让 DSH 不只回答一段文字。模型调用 `visualize` 后，Web UI 会在对话里直接出现一张可交互卡片，用来做模拟器、图表、对比面板或 UI mockup。

<div align="center">

[![DSH 对话内生成交互式可视化演示](assets/demo.webp)](assets/demo.mp4)

</div>

## 安装

推荐用 npm 装到 DSH 的 `web` profile：

```sh
dsh plugin --profile web add @nagi-ovo/dsh-visualize
# 如果 dsh web 正在运行，重启后刷新页面
```

也可以从 GitHub 安装：`dsh plugin --profile web add github:Nagi-ovo/dsh-visualize`。可以运行 `dsh --profile web --dump-config` 确认插件已经进入最终配置。需要修改源码时，克隆仓库并在仓库目录运行 `dsh plugin --profile web add .`；构建产物已经提交，不需要额外构建。使用社区 [plugin-registry](https://github.com/dsh-external/plugin-registry) 的用户也可以从「设置 → 插件」安装。

兼容 DSH 0.1.1-rc.2 到 0.2.1-rc.2。

## 怎么用

直接告诉模型你想看什么，例如「做一个能调参数的排序算法可视化」。模型调用 `visualize`，把整段 HTML fragment 直接作为 `fragment` 参数传入（可选 `title`、`mode`），卡片在模型生成参数时就开始渲染。适合并排比较的内容可以使用 `mode: "wide"`。要修正已经画出的卡片，模型用 `action: "update"` 加上卡片的 `path` 和一处 `old_str` → `new_str` 替换，不必重发整段 markup；`path` 只用于 `update`。

要做的东西比一张聊天卡片大时，比如带筛选的数据看板、多视图工具、全屏模拟或完整的桌面端 mockup，模型会用 `mode: "page"` 做一个独立页面。对话里显示一张启动卡片：标题、一行说明（`summary` 参数）、页面的实时缩略图和「打开页面」按钮，点按钮后页面在新标签页里全尺寸打开。浏览器拦下新标签页时，可以点「在对话中展开」直接在对话里查看。桌面端会先把页面交给宿主的侧边浏览器；侧边浏览器未启用时交给系统默认浏览器（首次需要重启应用以加载服务端路由）。用 `update` 改过页面后，已经打开的标签页不会自动刷新，再点一次「打开页面」即可。

卡片会跟随 DSH 的明暗主题，默认风格使用鲸鱼蓝配色（其他风格见下文）。聊天栏放不下时，点卡片标题行右侧的「在新窗口打开」按钮，可以在新标签页或桌面宿主浏览器里全尺寸查看，页面沿用打开那一刻的主题，内容仍在同样的 sandboxed iframe 里运行。会话重放时，页面从持久化的工具结果恢复，不依赖原始 fragment 文件仍然存在。

每张卡片的 fragment 另存一份到 `~/.dsh/visualize/sessions/<会话 id>/<标题>-<hash>.<style>.html`（设置了 `DSH_HOME` 时在 `$DSH_HOME/visualize/` 下），按会话分开，不写进你的项目目录，`git status` 不会出现 `viz/`。`update` 改写的就是这份文件。旧版本写在工作区 `viz/` 下的卡片仍然可以 `update`，原地修改。默认会保留最近 90 天的卡片，超过 90 天且整轮会话都没有近期活动的卡片文件会被后台清理（启动后 15 秒检查一次，之后每天一次）；正在使用的、带锁或临时文件的会话目录不会被删除。回放从工具事件中的不可变快照恢复，所以清理磁盘副本不影响回放；但已经过期的卡片无法再用 `update` 修改。可通过 `cardRetentionDays` 调整保留天数，设为 `0` 关闭自动清理并使用下文的手动维护命令。

支持会话尾部插槽的宿主会把已完成卡片统一放在这一轮回答下方，工具过程只保留轻量提示；无论工作步骤折叠还是完全展开，都不会再挂载第二份完整卡片。多张卡片默认展开第一张，其余可按需展开。旧宿主没有该能力时仍在工具结果原位显示。

## 卡片风格

插件内置 5 种卡片风格，默认是 `whale`。在 DSH 里点左下角「更多」→「设置」→「可视化」，每种风格都有一张按当前明暗主题实时渲染的预览卡，点一下就保存，下一张卡片立即生效，不用重启。

这个页面需要 DSH 0.1.7 及以上（宿主的设置表单 `configForms` 和 `/api` 路由；0.1.7 里「设置」在侧边栏左下角）。更早的版本里页面要么不出现，要么只给出下面的写法，请直接在 `<DSH_HOME>/profiles/web/cordis.patch.yml`（默认 `~/.dsh/profiles/web/cordis.patch.yml`）里加：

```yaml
- id: dsh-visualize
  name: "@nagi-ovo/dsh-visualize"
  config:
    style: sketch
```

设置页保存的也是这一条：它通过宿主的 dsh-settings 写进同一个 `cordis.patch.yml`，保留文件里的其他条目和注释。


| `style` | 风格 | 适合 |
| --- | --- | --- |
| `whale` | 鲸蓝（默认）：跟 DSH 界面同一套颜色和系统字体 | 什么都行 |
| `editorial` | 报刊：衬线标题直接写结论，一条线高亮、其余退成灰，直接标注 | 趋势、比较、「这个数说明了什么」 |
| `paper` | 论文：衬线、L 形坐标轴、色盲安全配色，颜色加标记形状双重编码，「图 1 ·」图注 | 实验结果、学习曲线、带公式的讲解 |
| `sketch` | 手绘：手写字体、rough.js 草图线条、荧光笔标注 | 概念、直觉、流程 |
| `terminal` | 终端：等宽字体、直角、虚线网格、key–value 标签 | 延迟、吞吐、算法逐步执行 |

风格分两层。颜色、字体、圆角、图表默认值（网格、轴线、线宽）由卡片外壳注入，每种风格都同时适配明暗主题，背景保持透明；版式和写法（标题怎么写、要不要图注、用不用 rough.js）是一段风格说明，附加在 skill 末尾交给模型。风格说明只替换 `design.md` 里的审美建议，fragment 规则、CSP、主题变量、11px 下限和 lint 都不受影响。产品界面 mockup 不套用风格，按被画产品自己的样子来。

每张卡片在持久化的结果和副本文件名里记下它生成时的风格，之后改设置不会改变已有卡片，会话重放、「在新窗口打开」和模型用 `update` 修改时都保持原样。更新时优先读取与内容哈希绑定的元数据副本，保留风格、显示模式和说明；更早的文件没有这些元数据时，使用文件名中的风格，没有风格标记则回退默认鲸蓝。模型还在写卡片时显示的预览，在 DSH 页面加载时读取设置；在设置页里切换会同时更新当前页面，手改 YAML 后刷新已打开的页面即可。`editorial`、`paper`、`sketch`、`terminal` 会从 Google Fonts 加载字体；`paper` 只在卡片里有公式时才加载 KaTeX。

### 自定义风格

在 Markdown 文件里用自然语言写下你的偏好，例如「主色用墨绿，标题不超过 12 个字，数字保留一位小数」。插件会把它附加在内置风格说明之后：

- 全局：`~/.dsh/visualize/style.md`（设置了 `DSH_HOME` 时是 `$DSH_HOME/visualize/style.md`），所有会话生效。
- 工作区：`<工作区>/.dsh/visualize-style.md`，只在这个工作区的会话里生效。

这两个文件也可以在「设置 → 可视化」下方直接查看和编辑（同样需要 DSH 0.1.7+），每个工作区一个；内容清空后保存会删除文件。

两者冲突时，优先级是：你在对话里说的 > 工作区文件 > 全局文件 > 内置风格。每个文件只读取前 4 KB，文件不存在就跳过。改动在模型下一次加载 visualize skill 时生效（通常是新会话的第一张卡片）。自定义风格只影响模型怎么写卡片，不改变外壳注入的颜色和字体；要换颜色，在说明里写明，模型会在卡片根元素上覆盖对应的主题变量。

## 安全

卡片运行在不透明来源的 sandboxed iframe 中，不能接触宿主页面。在新窗口打开（包括页面模式的「打开页面」）时，新标签页本身不含任何模型代码，fragment 依旧只在同样 sandbox 和 CSP 的 iframe 里运行，读不到 DSH 的 cookie、localStorage 或登录凭据。CSP 会阻止网络请求、嵌套页面和表单提交，只允许从固定 CDN 加载静态资源。单个 fragment 默认上限为 `1000000` 字节，可以通过 `maxFragmentBytes` 调整，硬上限为 4 MiB。

## 本地维护补丁

本地维护版基于 0.1.7，已编译的修复包保存在 `~/.dsh/visualize-maintenance/release/`，不依赖工作目录或 profile 目录存活。profile 的 `pnpm-workspace.yaml` 通过 `overrides` 把 `@nagi-ovo/dsh-visualize` 固定到这个本地 release，因此升级或重装插件、甚至改写 profile 的 `package.json`，都不会把实现换回 npm 版本。若整个 profile 目录被删除重建，运行一次 `node ~/.dsh/visualize-maintenance/install.mjs`（可加 `--profile <名字>`）即可重新接上；脚本会安装依赖并校验安装结果。

维护清理默认 dry-run，必须显式传入存储根目录，例如：

```sh
node node_modules/@nagi-ovo/dsh-visualize/lib/maintenance.mjs --root "C:/Users/你的用户名/.dsh/visualize"
```

检查输出后，用相同选项加 `--confirm <confirmationToken>` 才会执行；清单变化后须重新预览。默认只清理超过一天、所属进程已退出且没有活动卡片锁的已识别临时文件。`--include-stale-locks` 还允许预览并确认恢复已识别的过期死进程锁，不处理活动锁、未知格式、链接或历史 HTML/元数据。

新客户端兼容旧会话；较大的新工具元数据可能采用 gzip 压缩，需要本维护版或同样支持该格式的客户端回放，不保证降级到原版客户端后仍可见。此压缩不减少模型生成的 token，也不代表整个会话日志按同比例缩小。

## 限制

目前只在 Web UI 中渲染交互卡片，TUI 和 headless 客户端会显示普通工具结果。卡片内的按钮暂时不能向主对话发送 follow-up 消息。

灵感来自 Codex 桌面端的 `/visualize`；skill 的分层 reference 和 Chart.js 优先路线借鉴了 [himself65/finance-skills](https://github.com/himself65/finance-skills/tree/main/plugins/ui-tools/skills/generative-ui)。
