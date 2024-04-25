console.log('Mastocraper script loaded');

document.addEventListener('DOMContentLoaded', async function () {
    // Declare page elements
    const authContainer = document.getElementById('auth-container');
    const authFold = document.getElementById('auth-fold');
    const authUnfold = document.getElementById('auth-unfold');
    const instSpan = document.getElementById('instructions');
    const instDiv = document.getElementById('instructions-container');
    const instanceInput = document.getElementById('instance-input');
    const instanceSaveBtn = document.getElementById('instance-save');
    const idInput = document.getElementById('id-input');
    const idSaveBtn = document.getElementById('id-save');
    const secretInput = document.getElementById('secret-input');
    const secretSaveBtn = document.getElementById('secret-save');
    const getCodeBtn = document.getElementById('get-code-btn');
    const codeContainer = document.getElementById('code-container');
    const codeInput = document.getElementById('code-input');
    const codeSaveBtn = document.getElementById('code-save');
    const tokenContainer = document.getElementById('token-container');
    const tokenInput = document.getElementById('token-input');
    const tokenSaveBtn = document.getElementById('token-save');
    const allDone = document.getElementById('all-done');
    const searchFold = document.getElementById('search-fold');
    const searchUnfold = document.getElementById('search-unfold');
    const searchContainer = document.getElementById('search-container');
    const authBtnContainer = document.getElementById('auth-btn-container');
    const authBtn = document.getElementById('auth-btn');
    const allWordsInput = document.getElementById('all-words');
    const thisPhraseInput = document.getElementById('this-phrase');
    // const anyWordInput = document.getElementById('any-word');
    // const noWordInput = document.getElementById('no-word');
    const langInput = document.getElementById('lang');
    const accountInput = document.getElementById('account');
    const searchBtn = document.getElementById('search-btn');
    const searchMsg = document.getElementById('search-msg');
    const noResult = document.getElementById('no-result');
    const extractContainer = document.getElementById('extract-container');
    const formatSelect = document.getElementById('output-format');
    const maxTootsInput = document.getElementById('max-toots');
    const extractBtn = document.getElementById('extract-btn');
    const extractSpinner = document.getElementById('extract-spinner');
    const abortBtn = document.getElementById('abort-btn');
    const resultsContainer = document.getElementById('results-container');
    const resultsMsg = document.getElementById('results-msg');
    const dlBtn = document.getElementById('dl-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Assign role to Authentication header
    authFold.addEventListener('click', () => {
        if (authContainer.style.display === 'block') {
            authContainer.style.display = 'none';
            authFold.style.display = 'none';
            authUnfold.style.display = 'block';
        }
    });

    authUnfold.addEventListener('click', () => {
        if (authContainer.style.display === 'none') {
            authContainer.style.display = 'block';
            authFold.style.display = 'block';
            authUnfold.style.display = 'none';
        }
    });

    // Assign role to Instructions header
    instSpan.addEventListener('click', () => {
        if (instDiv.style.display === 'none') {
            instDiv.style.display = 'block';
            instSpan.textContent = 'Hide instructions';
        } else if (instDiv.style.display === 'block') {
            instDiv.style.display = 'none';
            instSpan.textContent = 'Show instructions';
        }
    });

    // Assign role to 'Build search query' header
    searchFold.addEventListener('click', () => {
        searchContainer.style.display = 'none';
        searchFold.style.display = 'none';
        searchUnfold.style.display = 'block';
    });

    searchUnfold.addEventListener('click', () => {
        searchContainer.style.display = 'block';
        searchFold.style.display = 'block';
        searchUnfold.style.display = 'none';
    });

    // Store credentials
    let mastoCred = 'mastoinstance';
    let mastoInstance;
    let idCred = 'masto_client_id';
    let secretCred = 'masto_client_secret';
    let codeCred = 'masto_client_code';
    let tokenCred = 'mastousertoken';

    let instancePlaceholder = 'Enter your Mastodon instance (example.instance)';
    let idPlaceholder = 'Enter your app client ID';
    let secretPlaceholder = 'Enter your app client secret';
    let codePlaceholder = 'Enter your code';
    let tokenPlaceholder = 'Enter your user token';

    let mastoDevUrl;

    // Store Mastodon instance
    instanceInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveCredential(
                instanceInput,
                mastoCred,
                instanceSaveBtn,
                instancePlaceholder
            );
            if (instanceInput.value) {
                mastoDevUrl =
                    'https://' + instanceInput.value + '/settings/applications';
                let devTab = chrome.tabs.create({
                    url: mastoDevUrl,
                });
                devTab;
            }
        }
    });
    instanceSaveBtn.addEventListener('click', () => {
        saveCredential(
            instanceInput,
            mastoCred,
            instanceSaveBtn,
            instancePlaceholder
        );
        if (instanceInput.value) {
            mastoDevUrl =
                'https://' + instanceInput.value + '/settings/applications';
            let devTab = chrome.tabs.create({
                url: mastoDevUrl,
            });
            devTab;
        }
    });

    // Store app ID
    idInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveCredential(idInput, idCred, idSaveBtn, idPlaceholder);
        }
    });
    idSaveBtn.addEventListener('click', () => {
        saveCredential(idInput, idCred, idSaveBtn, idPlaceholder);
    });

    // Store app secret
    secretInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveCredential(
                secretInput,
                secretCred,
                secretSaveBtn,
                secretPlaceholder
            );
            getCodeBtn.style.display = 'block';
        }
    });
    secretSaveBtn.addEventListener('click', () => {
        saveCredential(
            secretInput,
            secretCred,
            secretSaveBtn,
            secretPlaceholder
        );
        getCodeBtn.style.display = 'block';
    });

    // Store and declare authentication code
    codeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveCredential(codeInput, codeCred, codeSaveBtn, codePlaceholder);
            authBtnContainer.style.display = 'block';
        }
    });
    codeSaveBtn.addEventListener('click', () => {
        saveCredential(codeInput, codeCred, codeSaveBtn, codePlaceholder);
        authBtnContainer.style.display = 'block';
    });

    let clientCode = await retrieveCredential('masto_client_code');
    if (clientCode) {
        authBtnContainer.style.display = 'block';
    }

    // Store user token
    let userToken = await retrieveCredential('mastousertoken');

    if (!userToken) {
        authContainer.style.display = 'block';
        authFold.style.display = 'block';
        authUnfold.style.display = 'none';
        searchContainer.style.display = 'none';
        searchFold.style.display = 'none';
        searchUnfold.style.display = 'block';
        authBtnContainer.style.display = 'none';
        getCodeBtn.style.display = 'block';
    } else {
        codeContainer.style.display = 'block';
        getCodeBtn.style.display = 'block';
        authBtnContainer.style.display = 'block';
        tokenContainer.style.display = 'block';
        allDone.style.display = 'block';
        searchContainer.style.display = 'block';
        searchFold.style.display = 'block';
        searchUnfold.style.display = 'none';
    }

    tokenInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            saveCredential(
                tokenInput,
                tokenCred,
                tokenSaveBtn,
                tokenPlaceholder
            );
            userToken = await retrieveCredential('mastousertoken');
            if (userToken) {
                allDone.style.display = 'block';
                setTimeout(() => {
                    authContainer.style.display = 'none';
                    authFold.style.display = 'none';
                    authUnfold.style.display = 'block';
                    searchContainer.style.display = 'block';
                    searchFold.style.display = 'block';
                    searchUnfold.style.display = 'none';
                }, 1000);
            }
        }
    });
    tokenSaveBtn.addEventListener('click', async function () {
        saveCredential(tokenInput, tokenCred, tokenSaveBtn, tokenPlaceholder);
        userToken = await retrieveCredential('mastousertoken');
        if (userToken) {
            allDone.style.display = 'block';
            setTimeout(() => {
                authContainer.style.display = 'none';
                authFold.style.display = 'none';
                authUnfold.style.display = 'block';
                searchContainer.style.display = 'block';
                searchFold.style.display = 'block';
                searchUnfold.style.display = 'none';
            }, 1000);
        } else {
            allDone.style.display = 'none';
        }
    });

    // Functions to check for credentials
    function getCredential(credType, callback) {
        chrome.storage.local.get([credType], function (result) {
            const credential = result[credType] || '';
            callback(credential);
        });
    }

    function handleCredential(credType, inputElement, buttonElement) {
        getCredential(credType, function (credentialResult) {
            let credential = credentialResult;
            if (credential) {
                console.log(credType + ' stored: ', credential);
                inputElement.placeholder =
                    'Value stored: enter new value to reset';
                buttonElement.textContent = 'Reset';
            } else {
                console.log('No ' + credType + ' set');
            }
        });
    }

    handleCredential(
        'mastoinstance',
        instanceInput,
        instanceSaveBtn,
        instancePlaceholder
    );
    handleCredential('masto_client_id', idInput, idSaveBtn, idPlaceholder);
    handleCredential(
        'masto_client_secret',
        secretInput,
        secretSaveBtn,
        secretPlaceholder
    );
    handleCredential(
        'masto_client_code',
        codeInput,
        codeSaveBtn,
        codePlaceholder
    );
    handleCredential(
        'mastousertoken',
        tokenInput,
        tokenSaveBtn,
        tokenPlaceholder
    );

    // Function to store credentials
    async function saveCredential(input, credType, button, placeholder) {
        credential = input.value;
        console.log(credType + ':', credential);
        if (credential) {
            chrome.storage.local.set({ [credType]: credential }, function () {
                button.style.backgroundColor = '#006600';
                button.style.color = 'white';
                button.style.borderColor = '#006600';
                button.textContent = 'Saved';
                input.placeholder = 'Value stored: enter new value to reset';
                input.value = '';
                setTimeout(() => {
                    button.removeAttribute('style');
                    button.textContent = 'Reset';
                }, 2000);
            });
            console.log(credType + ' set: ', credential);
        } else {
            chrome.storage.local.remove([credType], function () {
                button.style.backgroundColor = '#006600';
                button.style.color = 'white';
                button.style.borderColor = '#006600';
                button.textContent = 'Value reset';
                input.value = '';
                input.placeholder = placeholder;
                setTimeout(() => {
                    button.removeAttribute('style');
                    button.textContent = 'Save';
                }, 2000);
            });
            console.log(credType + ' reset');
        }
    }

    // Function to obtain authentication code
    async function getCode() {
        // Retrieve credentials from storage
        mastoInstance = await retrieveCredential('mastoinstance');
        let clientID = await retrieveCredential('masto_client_id');

        if (!mastoInstance) {
            window.alert('Please enter your Mastodon instance');
            return;
        }
        if (!clientID) {
            window.alert('Please provide authentication details');
            return;
        }

        // Build query form
        const form = document.getElementById('auth-form-1');
        form.setAttribute('target', '_blank');
        const idAuthInput = document.getElementById('id-auth-input');
        const uriInput = document.getElementById('redirect-input');
        const restypeInput = document.getElementById('restype-input');
        form.setAttribute(
            'action',
            'https://' + mastoInstance + '/oauth/authorize'
        );
        restypeInput.setAttribute('value', 'code');
        idAuthInput.setAttribute('value', clientID.trim());
        uriInput.setAttribute('value', 'urn:ietf:wg:oauth:2.0:oob');

        form.submit();
    }

    getCodeBtn.addEventListener('click', () => {
        getCode();
        codeContainer.style.display = 'block';
        authBtnContainer.style.display = 'block';
    });

    // Function to obtain user token
    async function authorize() {
        // Retrieve credentials from storage
        mastoInstance = await retrieveCredential('mastoinstance');
        let clientID = await retrieveCredential('masto_client_id');
        let clientSecret = await retrieveCredential('masto_client_secret');
        let clientCode = await retrieveCredential('masto_client_code');

        if (!mastoInstance) {
            window.alert('Please enter your Mastodon instance');
            return;
        }
        if (!clientID || !clientSecret || !clientCode) {
            window.alert('Please provide authentication details');
            return;
        }

        // Build query form
        const form = document.getElementById('auth-form-2');
        form.setAttribute('target', '_blank');
        const idAuthInput = document.getElementById('id-auth-input-2');
        const secretAuthInput = document.getElementById('secret-auth-input-2');
        const codeAuthInput = document.getElementById('code-auth-input');
        const uriInput = document.getElementById('redirect-input-2');
        const grantTypeInput = document.getElementById('granttype-input');
        form.setAttribute(
            'action',
            'https://' + mastoInstance + '/oauth/token'
        );
        grantTypeInput.setAttribute('value', 'authorization_code');
        codeAuthInput.setAttribute('value', clientCode.trim());
        idAuthInput.setAttribute('value', clientID.trim());
        secretAuthInput.setAttribute('value', clientSecret.trim());
        uriInput.setAttribute('value', 'urn:ietf:wg:oauth:2.0:oob');

        form.submit();
    }

    authBtn.addEventListener('click', async () => {
        authorize();
        tokenContainer.style.display = 'block';
    });

    // Function to retrieve credential from storage
    function retrieveCredential(credType) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([credType], function (result) {
                const credential = result[credType] || '';
                resolve(credential);
            });
        });
    }

    // Logic to build query URL from inputs
    let queryUrl;
    let lang;

    async function buildQueryUrl() {
        mastoInstance = await retrieveCredential('mastoinstance');
        if (!mastoInstance) {
            window.alert('Please enter your Mastodon instance');
        }
        queryUrl = 'https://' + mastoInstance + '/api/v2/search?';

        // Concatenate query URL from search elements
        let allWords = allWordsInput.value.replaceAll(' ', ' AND ');
        let thisPhrase = thisPhraseInput.value;
        // let anyWord = anyWordInput.value.replaceAll(' ', ' OR ');
        // let noWord = noWordInput.value.replaceAll(' ', ' NOT ');
        lang = langInput.value;
        let account = accountInput.value.replaceAll(' ', ' AND ');
        if (allWords || thisPhrase || anyWord || noWord) {
            queryUrl = queryUrl + 'q=';
        }
        if (allWords) {
            queryUrl = queryUrl + allWords;
        }
        if (thisPhrase) {
            if (allWords) {
                queryUrl = queryUrl + ' AND ';
            }
            queryUrl = queryUrl + '"' + thisPhrase + '"';
        }
        // if (anyWord) {
        //     if (allWords || thisPhrase) {
        //         queryUrl = queryUrl + ' AND ';
        //     }
        //     queryUrl = queryUrl + anyWord;
        // }
        // if (noWord) {
        //     if (allWords || thisPhrase || anyWord) {
        //         queryUrl = queryUrl + ' NOT ';
        //     }
        //     queryUrl = queryUrl + noWord;
        // }
        if (account) {
            getIdUrl =
                'https://' +
                mastoInstance +
                '/api/v1/accounts/lookup?acct=' +
                account;
            const idResponse = await fetch(getIdUrl);
            if (idResponse.ok) {
                const idData = await idResponse.json();
                account = idData.id;
            }
            if (allWords || thisPhrase || anyWord || noWord || lang) {
                queryUrl = queryUrl + '&';
            }
            queryUrl = queryUrl + 'account_id=' + account;
        }
        queryUrl = queryUrl + '&type=statuses&resolve=true';
        queryUrl = encodeURI(queryUrl);
        console.log('Query URL = ', queryUrl);

        // Fetch query response from server
        try {
            if (!allWords && !thisPhrase && !anyWord) {
                window.alert('Please provide keywords');
                searchMsg.style.display = 'none';
                return;
            }
            userToken = await retrieveCredential('mastousertoken');
            const response = await fetch(queryUrl, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    scope: 'read',
                },
            });
            if (response.status === 401) {
                searchMsg.style.display = 'none';
                window.alert(
                    'Application not authorized: please authenticate with Mastodon'
                );
                authContainer.style.display = 'block';
                codeInput.setAttribute(
                    'placeholder',
                    'Click "Get code" to obtain a new code'
                );
                tokenInput.setAttribute(
                    'placeholder',
                    'Click "Authorize" to obtain a new token'
                );
                throw new Error('User needs to authorize app');
            } else if (!response || !response.ok) {
                window.alert(
                    `Error fetching results: status ${response.status}`
                );
                searchMsg.style.display = 'none';
                throw new Error('Could not fetch search results.');
            }
            const searchData = await response.json();
            const searchResults = searchData.statuses;
            if (searchResults.length == 0) {
                searchMsg.style.display = 'none';
                noResult.style.display = 'block';
            } else {
                searchMsg.style.display = 'none';
                searchContainer.style.display = 'none';
                searchFold.style.display = 'none';
                searchUnfold.style.display = 'block';
                extractContainer.style.display = 'block';
                extractBtn.style.display = 'block';
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Assign role to search button
    searchBtn.addEventListener('click', () => {
        extractContainer.style.display = 'none';
        searchMsg.style.display = 'block';
        noResult.style.display = 'none';
        buildQueryUrl();
    });

    // Declare extraction variables
    let maxToots;
    maxTootsInput.addEventListener('change', () => {
        maxToots = maxTootsInput.value;
        if (!maxToots) {
            maxToots = Infinity;
        }
    });

    let fileFormat = 'xml';
    formatSelect.addEventListener('change', () => {
        fileFormat = formatSelect.value;
        console.log('File format changed to ', fileFormat);
        dlBtn.textContent = 'Download ' + fileFormat.toUpperCase();
    });

    let file;
    let statuses;
    let id;
    let csvData = [];
    let tootCount = 1;
    let nextQueryUrl;

    // Assign function to extract button
    extractBtn.addEventListener('click', () => {
        triggerScrape();
    });

    async function triggerScrape() {
        formatSelect.disabled = true;
        maxTootsInput.disabled = true;
        abortBtn.style.display = 'block';
        extractBtn.style.display = 'none';
        resultsContainer.style.display = 'block';
        dlBtn.style.display = 'none';
        try {
            await scrape();
            abortBtn.style.display = 'none';
            extractBtn.style.display = 'block';
            extractBtn.disabled = true;
            extractSpinner.style.display = 'none';
            tootCount = tootCount - 1;
            resultsMsg.textContent = tootCount + ' toot(s) extracted';
            dlBtn.style.display = 'inline-block';
            resetBtn.style.display = 'inline-block';
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    // Assign function to abort button
    abortBtn.addEventListener('click', () => {
        abortBtn.textContent = 'Aborting...';
        abort = true;
    });

    // Function to scrape toots
    async function scrape() {
        let tootSet = new Set();
        abort = false;
        extractBtn.style.display = 'none';
        abortBtn.style.display = 'block';
        if (!maxToots) {
            maxToots = Infinity;
        }
        if (fileFormat === 'xml') {
            file = `<Text>`;
        } else if (fileFormat === 'json') {
            file = {};
        } else if (fileFormat === 'txt') {
            file = '';
        } else if (fileFormat === 'csv') {
            csvData = [];
        }

        let p = 1;
        while (tootCount <= maxToots) {
            await processPage();

            if (tootCount > maxToots || abort) {
                if (fileFormat === 'xml') {
                    file =
                        file +
                        `

</Text>`;
                }
                abortBtn.textContent = 'Abort';
                abortBtn.style.display = 'none';
                extractBtn.style.display = 'block';
                extractBtn.disabled = true;
                dlBtn.style.display = 'block';
                abort = false;
                break;
            }
        }

        async function processPage() {
            try {
                if (maxToots) {
                    maxToots = Number(maxToots);
                }
                if (p === 1) {
                    nextQueryUrl = queryUrl;
                } else if (p > 1) {
                    nextQueryUrl = queryUrl + '&max_id=' + id.toString();
                }
                if (maxToots !== Infinity) {
                    nextQueryUrl = nextQueryUrl + '&limit=' + maxToots;
                } else {
                    nextQueryUrl = nextQueryUrl + '&limit=40';
                }
                console.log('Extracting query URL = ', nextQueryUrl);
                const response = await fetch(nextQueryUrl, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        scope: 'read',
                    },
                });
                if (response.status === 401) {
                    window.alert(
                        'Application not authorized: please authenticate with Mastodon'
                    );
                    throw new Error('Could not fetch: not authenticated');
                } else if (!response.ok) {
                    window.alert(
                        `Error fetching results: HTTP error ${response.status}`
                    );
                    throw new Error(
                        'HTTP error, could not fetch search results'
                    );
                }
                const data = await response.json();
                statuses = data.statuses;
                console.log(
                    'Number of statuses in next batch: ',
                    statuses.length
                );
                if (
                    statuses.length == 0 ||
                    (tootCount > 1 && statuses.length <= 1)
                ) {
                    abort = true;
                }
                for (s of statuses) {
                    console.log('Status being processed: ', s);
                    const parser = new DOMParser();
                    id = s.id;
                    if (tootSet.has(id)) {
                        continue;
                    }
                    let sLang = s.language;
                    if (lang && sLang !== lang) {
                        continue;
                    }
                    tootSet.add(id);
                    username = s.account.acct;
                    date = s.created_at.split('T')[0];
                    let rawText = s.content;
                    let rawTextHtml = parser.parseFromString(
                        rawText,
                        'text/html'
                    );
                    let rawTextString = rawTextHtml.documentElement.innerHTML;
                    rawTextString = rawTextString
                        .replaceAll('<br>', '\n')
                        .replaceAll('<p>', '\n')
                        .replaceAll(/<.+?>/gu, '');
                    text = rawTextString.normalize('NFC');
                    url = s.url;

                    if (fileFormat === 'xml') {
                        username = username
                            .replaceAll('&', '&amp;')
                            .replaceAll('<', '&lt;')
                            .replaceAll('>', '&gt;')
                            .replaceAll('"', '&quot;')
                            .replaceAll("'", '&apos;');
                        text = text
                            .replaceAll('<', '&lt;')
                            .replaceAll('>', '&gt;')
                            .replaceAll('"', '&quot;')
                            .replaceAll("'", '&apos;')
                            .replaceAll('&nbsp;', ' ');
                        const urlRegex =
                            /(?:https?|ftp):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]/;
                        const links = text.match(urlRegex);
                        if (links) {
                            for (l of links) {
                                const newLink = l.replace(
                                    /(.+)/,
                                    `<ref target="$1">$1</ref>`
                                );
                                text = text.replace(l, newLink);
                            }
                        }
                        text = text.replaceAll('\n', ' ');
                        file =
                            file +
                            `<lb></lb><lb></lb>
<toot id="${id}" username="${username}" date="${date}"><lb></lb>
<ref target="${url}">${url}</ref><lb></lb><lb></lb>
${text}
</toot>
<lb></lb><lb></lb>`;
                    } else if (fileFormat === 'txt') {
                        file = file + `\n\n${text}`;
                    } else if (fileFormat === 'json') {
                        file[id] = {
                            username: `${username}`,
                            date: `${date}`,
                            text: `${text}`,
                        };
                    } else if (fileFormat === 'csv') {
                        text = text.replaceAll('\n', ' ');
                        csvData.push({ username, date, text });
                    }
                    if (maxToots !== Infinity) {
                        let tootPercent = Math.round(
                            (tootCount / maxToots) * 100
                        );
                        resultsMsg.textContent = `${tootPercent}% extracted...`;
                    } else {
                        resultsMsg.textContent = `${tootCount} toot(s) extracted...`;
                    }
                    if (lang && sLang === lang) {
                        tootCount++;
                    } else if (!lang) {
                        tootCount++;
                    }
                    if (tootCount > maxToots) {
                        return;
                    }
                }
                p++;
            } catch (error) {
                console.error(error);
            }
        }
    }

    // Assign role to download button
    dlBtn.addEventListener('click', () => {
        download();
        const dlResult = document.getElementById('dl-result');
        dlResult.style.display = 'block';
        dlResult.textContent = fileFormat.toUpperCase() + ' file downloaded';
    });

    // Function to download output file
    function download() {
        if (fileFormat === 'xml') {
            var myBlob = new Blob([file], { type: 'application/xml' });
        } else if (fileFormat === 'json') {
            var fileString = JSON.stringify(file);
            var myBlob = new Blob([fileString], { type: 'text/plain' });
        } else if (fileFormat === 'txt') {
            var myBlob = new Blob([file], { type: 'text/plain' });
        } else if (fileFormat === 'csv') {
            function convertToCsv(data) {
                const header = Object.keys(data[0]).join('\t');
                const rows = data.map((obj) => Object.values(obj).join('\t'));
                return [header, ...rows].join('\n');
            }
            const csvString = convertToCsv(csvData);
            var myBlob = new Blob([csvString], { type: 'text/csv' });
        }
        var url = window.URL.createObjectURL(myBlob);
        var anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `toots.${fileFormat}`;
        anchor.click();
        window.URL.revokeObjectURL(url);
    }

    // Assign role to reset button
    resetBtn.addEventListener('click', () => {
        location.reload();
    });
});
