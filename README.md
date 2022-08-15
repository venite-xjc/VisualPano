# VisualPano README

This extension aims to provide a panorama view for a single image.

该插件能够将单张图转化为360度全景视图

Support simultaneous visualization of multiple images, support fixed perspective to better compare your different panorama images

支持在同一界面中展开多个全景，支持全景图片锁定视角对比


右键图片，使用
`VisualPano: Start a panorama view | 开启全景`
命令，打开webveiw

#### operate
- 右键选择`VisualPano: Start a panorama view | 开启全景`将图片展示到webview中
- 锁定按钮选中后，会同步所有全景的视角
- 添加按钮选中后，如果选择展示新的图片，不会覆盖当前图片，而是添加一个新的视图
- 数据按钮按下后，会显示垂直fov,$\phi$和$\theta$
- 左上角可关闭视图

---
### 0.0.1

仅支持简单的预览，不支持自动焦点更新。

### 1.0.0

重构，改用three.js实现，可以同时支持可视化多张图片，并且可以同步所有图片的视角，便于进行对比。由于尚且没有找到webview对drag事件以及对焦点的跟踪api，仍然不支持自动更新图片，需要手动右键选择图片。

### 1.1.0

更新了界面，可以显示fov和角度信息，可以关闭视图。

---
based on:
- three.js

