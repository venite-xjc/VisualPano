// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs')
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let currentPanel = undefined;

	context.subscriptions.push(
		vscode.commands.registerCommand('VisualPano.start', (uri)=>{
			
			if (currentPanel) {
				currentPanel.dispose();
				currentPanel = undefined;
			} 
				currentPanel = vscode.window.createWebviewPanel(
					'panorama',
					'panorama',
					vscode.ViewColumn.Two,
					{
						enableScripts: true, 
            			retainContextWhenHidden: true,
					}
				);
				currentPanel.webview.html = getWebViewContent(context, './src/index.html');

				currentPanel.onDidDispose(
					() => {
						currentPanel = undefined;
					},
					null,
					context.subscriptions
				);
			
			if(uri) {
				console.log('有uri');
			currentPanel.webview.postMessage({text: currentPanel.webview.asWebviewUri(uri).toString()});
			} else {
				console.log("没有uri");
			}
		})
	);
}

// this method is called when your extension is deactivated
function deactivate() {

}


function getWebviewFileResource(context, panel, relativePath) {
	const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, relativePath)
      );
	let vscodeUriPath = panel.webview.asWebviewUri(onDiskPath);
	let webviewResourceUri = onDiskPath.with({ scheme: 'vscode-resource' }).toString();
	return webviewResourceUri;
}

function getWebViewContent(context, templatePath) {

    const resourcePath = path.join(context.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
	console.log(html);
    html = html.replace(/(<link.+?href="|<script.+?src="|<iframe.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        if($2.indexOf("https://")<0)return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
        else return $1 + $2+'"';
    });
	console.log(html);
    return html;
}

module.exports = {
	activate,
	deactivate
}
