const vscode = require('vscode');
const axios = require('axios');
const {XMLParser} = require('fast-xml-parser');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	const ress =await axios.get("https://blog.webdevsimplified.com/rss.xml");
	const parser = new XMLParser();
	const articles= parser.parse(ress.data).rss.channel.item.map(
		article=>{
			return{
				lable:article.title,
				detail:article.description,
				link:article.link,
			}
		}
	);
	console.log(articles);
	let disposable = vscode.commands.registerCommand('test-extension.readBlog', async function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const article = await vscode.window.showQuickPick(articles,{
			matchOnDetail:true,
		});
		if(article==null) return;
		vscode.env.openExternal(vscode.Uri.parse(article.link));
	});
	let disposableHello = vscode.commands.registerCommand('test-extension.sayHello', () => {

		vscode.window.showInformationMessage('Hello, Shashank!');
	});

	let disposableDate = vscode.commands.registerCommand('test-extension.showDate', () => {
		vscode.window.showInformationMessage(new Date().toLocaleString());
	});

	let disposableCustomCommand = vscode.commands.registerCommand('test-extension.customCommand',async () => {
		
		
		vscode.window.showInputBox({ prompt: 'Enter search term' }).then((searchTerm) => {
			if (searchTerm) {
				searchWikipedia(searchTerm);
			}
        });
	});
	let disposablejsonPlaceholder = vscode.commands.registerCommand('test-extension.jsonPlaceholderPaste', async () => {
        //const userId = await vscode.window.showInputBox({ prompt: 'Enter user ID from JSONPlaceholder' });

        if (true) {
            const userData = await fetchUserData(1);
            insertUserData(userData);
        }
    });
	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableHello);
	context.subscriptions.push(disposableDate);
	context.subscriptions.push(disposableCustomCommand);
	context.subscriptions.push(disposablejsonPlaceholder);
}
async function fetchUserData(userId) {
    try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return response.data;
    } catch (error) {
        vscode.window.showErrorMessage('Failed to fetch user data from JSONPlaceholder.');
        return null;
    }
}
function insertUserData(userData) {
    if (!userData) {
        return;
    }

    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const jsonText = JSON.stringify(userData, null, 2);
        activeEditor.edit((editBuilder) => {
            editBuilder.insert(activeEditor.selection.start, jsonText);
        });
    } else {
        vscode.window.showErrorMessage('Open a text editor before running this command.');
    }
}

function searchWikipedia(searchTerm) {
    const searchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(searchTerm)}`;
    vscode.env.openExternal(vscode.Uri.parse(searchUrl));
}
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
