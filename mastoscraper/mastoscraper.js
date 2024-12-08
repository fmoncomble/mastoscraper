console.log('Mastocraper script loaded');

document.addEventListener('DOMContentLoaded', async function () {
    // Declare page elements
    const authContainer = document.getElementById('auth-container');
    const authFold = document.getElementById('auth-fold');
    const authUnfold = document.getElementById('auth-unfold');
    const instSpan = document.getElementById('instructions');
    const instDiv = document.getElementById('instructions-container');
    const instanceContainer = document.getElementById('instance-container');
    const instanceInput = document.getElementById('instance-input');
    const instanceSaveBtn = document.getElementById('instance-save');
    const allDone = document.getElementById('all-done');
    const resetAuthBtn = document.getElementById('reset-auth');
    const searchFold = document.getElementById('search-fold');
    const searchUnfold = document.getElementById('search-unfold');
    const searchContainer = document.getElementById('search-container');
    const searchModeSelect = document.getElementById('search-mode');
    const guidedSearchDiv = document.getElementById('guided-search');
    const expertSearchDiv = document.getElementById('expert-search');
    const keywordsInput = document.getElementById('keywords');
    const allWordsInput = document.getElementById('all-words');
    const anyWordsInput = document.getElementById('any-words');
    const thisPhraseInput = document.getElementById('this-phrase');
    const noWordsInput = document.getElementById('no-words');
    const langInput = document.getElementById('lang');
    const accountInput = document.getElementById('account');
    const searchInstanceInput = document.getElementById('search-instance');
    const fromDateInput = document.getElementById('from-date');
    const toDateInput = document.getElementById('to-date');
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
    const dlResult = document.getElementById('dl-result');
    const notice = document.getElementById('notice');
    const dismissBtn = document.getElementById('dismiss');

    // Declare credentials
    let mastoInstance;
    let clientId;
    let clientSecret;
    chrome.storage.local.get(['mastoinstance'], (result) => {
        mastoInstance = result.mastoinstance;
    });
    chrome.storage.local.get(['mastoclientid'], (result) => {
        clientId = result.mastoclientid;
    });
    chrome.storage.local.get(['mastoclientsecret'], (result) => {
        clientSecret = result.mastoclientsecret;
    });

    // Manage notice
    let understand;
    let userToken;

    //Functions to handle user token
    getUserToken(function (userTokenResult) {
        userToken = userTokenResult;

        if (userToken) {
            instSpan.style.display = 'none';
            instDiv.style.display = 'none';
            instanceContainer.style.display = 'none';
            allDone.style.display = 'block';
            searchContainer.style.display = 'block';
            searchFold.style.display = 'block';
            searchUnfold.style.display = 'none';
        } else {
            authContainer.style.display = 'block';
            authFold.style.display = 'block';
            authUnfold.style.display = 'none';
            searchContainer.style.display = 'none';
            searchFold.style.display = 'none';
            searchUnfold.style.display = 'block';
        }
    });

    function getUserToken(callback) {
        chrome.storage.local.get(['mastousertoken'], function (result) {
            const mastousertoken = result.mastousertoken || '';
            callback(mastousertoken);
        });
    }

    async function saveUserToken() {
        chrome.storage.local.set({ mastousertoken: userToken }, function () {
            allDone.style.display = 'block';
            instSpan.style.display = 'none';
            instDiv.style.display = 'none';
            instanceContainer.style.display = 'none';
            setTimeout(() => {
                authContainer.style.display = 'none';
                authFold.style.display = 'none';
                authUnfold.style.display = 'block';
                searchContainer.style.display = 'block';
                searchFold.style.display = 'block';
                searchUnfold.style.display = 'none';
            }, 1000);
        });
    }

    async function removeUserToken() {
        const formData = new FormData();
        formData.append('client_id', clientId);
        formData.append('client_secret', clientSecret);
        formData.append('token', userToken);

        const url = 'https://' + mastoInstance + '/oauth/revoke';

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                window.alert(
                    'Could not revoke authorization: server responded with error ' +
                        response.status
                );
                throw new Error('Could not revoke token: ', response.status);
            } else {
                window.alert('Authorization successfully revoked');
            }
        } catch (error) {
            console.error('Error: ', error);
        }
        chrome.storage.local.remove('mastousertoken', function () {
            userToken = null;
        });
    }

    // Functions to handle notice
    getUnderstand(function (understandResult) {
        understand = understandResult;
        if (userToken && understand) {
            notice.style.display = 'none';
        } else {
            notice.style.display = 'block';
        }
    });

    function getUnderstand(callback) {
        chrome.storage.local.get(['understand'], function (result) {
            const understand = result.understand || '';
            callback(understand);
        });
    }

    async function saveUnderstand() {
        chrome.storage.local.set({ understand: 'understand' }, function () {
            notice.style.display = 'none';
        });
    }

    async function removeUnderstand() {
        chrome.storage.local.remove('understand', function () {
            notice.style.display = 'block';
        });
    }

    dismissBtn.addEventListener('click', () => {
        saveUnderstand();
    });

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

    // Assign function to Mastodon instance input & button
    instanceInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (instanceInput.value) {
                mastoInstance = instanceInput.value.trim();
                if (mastoInstance.startsWith('http')) {
                    mastoInstance = mastoInstance.split('/')[2];
                }
                chrome.storage.local.set({
                    mastoinstance: mastoInstance,
                });
                authenticate();
            } else {
                window.alert('Entrez votre instance Mastodon');
                instanceInput.focus();
            }
        }
    });
    instanceSaveBtn.addEventListener('click', () => {
        if (instanceInput.value) {
            mastoInstance = instanceInput.value.trim();
            if (mastoInstance.startsWith('http')) {
                mastoInstance = mastoInstance.split('/')[2];
            }
            chrome.storage.local.set({
                mastoinstance: mastoInstance,
            });
            authenticate();
        } else {
            window.alert('Entrez votre instance Mastodon');
            instanceInput.focus();
        }
    });

    // Oauth flow function
    async function authenticate() {
        let instance = instanceInput.value.trim();
        let redirectUri;
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf('Chrome') > -1) {
            redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/`;
        } else if (userAgent.indexOf('Firefox') > -1) {
            redirectUri = browser.identity.getRedirectURL();
        }
        console.log('Redirect URI = ', redirectUri);
        let createAppUrl = `https://${instance}/api/v1/apps`;
        let response = await fetch(createAppUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_name: 'MastoScraper',
                redirect_uris: redirectUri,
                scopes: 'read',
                website: redirectUri,
            }),
        });
        if (!response.ok) {
            let errorData = await response.json();
            console.error('Error creating app: ', response.status, errorData);
            return;
        } else if (response && response.ok) {
            let data = await response.json();
            clientId = data.client_id;
            chrome.storage.local.set({ mastoclientid: clientId });
            clientSecret = data.client_secret;
            chrome.storage.local.set({ mastoclientsecret: clientSecret });
            console.log(
                `App created with ID ${clientId} and secret ${clientSecret}`
            );
        }
        chrome.identity.launchWebAuthFlow(
            {
                url: `https://${instanceInput.value}/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=read`,
                interactive: true,
            },
            (redirectUrl) => {
                if (chrome.runtime.lastError || !redirectUrl) {
                    console.error(chrome.runtime.lastError);
                    return;
                }
                const urlParams = new URLSearchParams(
                    new URL(redirectUrl).search
                );
                const code = urlParams.get('code');
                fetch(`https://${instance}/oauth/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        client_id: clientId,
                        client_secret: clientSecret,
                        grant_type: 'authorization_code',
                        code: code,
                        redirect_uri: redirectUri,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        userToken = data.access_token;
                        saveUserToken();
                        console.log('Access token:', userToken);
                    })
                    .catch((error) => console.error('Error: ', error));
            }
        );
    }

    // Reset authentication button
    resetAuthBtn.addEventListener('click', async () => {
        await removeUserToken();
        removeUnderstand();
        instanceContainer.style.display = 'block';
        allDone.style.display = 'none';
        searchContainer.style.display = 'none';
        location.reload();
    });

    // Logic to build query URL from inputs
    let queryUrl;
    let lang;
    accountInput.addEventListener('change', () => {
        accountInput.removeAttribute('style');
    });

    let fromDate;
    let min_id;
    fromDateInput.addEventListener('change', () => {
        fromDate = new Date(fromDateInput.value);
        const fromDateStamp = BigInt(fromDate.getTime() / 1000);
        min_id = (fromDateStamp << 16n) * 1000n;
    });

    let toDate;
    let max_id;
    toDateInput.addEventListener('change', () => {
        toDate = new Date(toDateInput.value);
        const toDateStamp = BigInt(toDate.getTime() / 1000);
        max_id = (toDateStamp << 16n) * 1000n;
    });

    let searchMode = 'guided';

    searchModeSelect.addEventListener('change', () => {
        searchMode = searchModeSelect.value;
        if (searchMode === 'guided') {
            guidedSearchDiv.style.display = 'block';
            expertSearchDiv.style.display = 'none';
        } else if (searchMode === 'expert') {
            guidedSearchDiv.style.display = 'none';
            expertSearchDiv.style.display = 'block';
        }
    });

    async function buildQueryUrl() {
        // mastoInstance = await retrieveCredential('mastoinstance');
        if (!mastoInstance) {
            window.alert('Please enter your Mastodon instance');
            searchMsg.style.display = 'none';
            return;
        }
        queryUrl = 'https://' + mastoInstance + '/api/v2/search?';

        // Concatenate query URL from search elements
        let keywords = keywordsInput.value;
        let allWords = allWordsInput.value.replaceAll(' ', ' AND ');
        let anyWords = anyWordsInput.value.replaceAll(' ', ' OR ');
        let thisPhrase = thisPhraseInput.value;
        let noWords = noWordsInput.value.replaceAll(' ', ' OR ');
        lang = langInput.value;
        let account = accountInput.value.replaceAll(' ', ' AND ');
        if (fromDate) {
        }
        if (searchMode === 'expert') {
            keywords = `(${keywords})`;
            queryUrl = queryUrl + 'q=' + keywords;
        } else if (searchMode === 'guided') {
            if (allWords || anyWords || thisPhrase) {
                queryUrl = queryUrl + 'q=';
            }
            if (allWords) {
                queryUrl = queryUrl + `(${allWords})`;
            }
            if (anyWords) {
                if (allWords) {
                    queryUrl = queryUrl + ' AND ';
                }
                queryUrl = queryUrl + `(${anyWords})`;
            }
            if (thisPhrase) {
                if (allWords || anyWords) {
                    queryUrl = queryUrl + ' AND ';
                }
                queryUrl = queryUrl + '("' + thisPhrase + '")';
            }
            if (noWords) {
                if (allWords || anyWords || thisPhrase) {
                    queryUrl = queryUrl + ' NOT ';
                }
                queryUrl = queryUrl + `(${noWords})`;
            }
        }
        if (account) {
            try {
                getIdUrl =
                    'https://' +
                    mastoInstance +
                    '/api/v1/accounts/lookup?acct=' +
                    account;
                const idResponse = await fetch(getIdUrl);
                if (idResponse.ok) {
                    const idData = await idResponse.json();
                    account = idData.id;
                } else {
                    window.alert('Account not found');
                    searchMsg.style.display = 'none';
                    accountInput.style.outline = 'solid 2px #e60000';
                    accountInput.style.border = 'solid 1px #e60000';
                    accountInput.focus();
                    return;
                }
                if (allWords || anyWords || thisPhrase) {
                    queryUrl = queryUrl + '&';
                }
                queryUrl = queryUrl + 'account_id=' + account;
            } catch (error) {
                console.error(error);
            }
        }
        if (fromDate) {
            if (allWords || anyWords || thisPhrase) {
                queryUrl = queryUrl + '&';
            }
            queryUrl = queryUrl + 'min_id=' + min_id;
        }
        if (toDate) {
            if (allWords || anyWords || thisPhrase) {
                queryUrl = queryUrl + '&';
            }
            queryUrl = queryUrl + 'max_id=' + max_id;
        }
        queryUrl = queryUrl + '&type=statuses&resolve=true';
        queryUrl = encodeURI(queryUrl);
        const queryurlDiv = document.getElementById('queryurl');
        const queryLink = document.createElement('a');
        queryLink.setAttribute('href', queryUrl);
        queryLink.setAttribute('target', '_blank');
        queryLink.textContent = queryUrl;
        queryLink.style.fontWeight = 'normal';
        queryurlDiv.textContent = 'Query URL: ';
        queryurlDiv.appendChild(queryLink);

        // Fetch query response from server
        try {
            if (!keywords && !allWords && !anyWords && !thisPhrase) {
                window.alert('Please provide keywords');
                searchMsg.style.display = 'none';
                return;
            }
            // userToken = await retrieveCredential('mastousertoken');
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
                authFold.style.display = 'block';
                authUnfold.style.display = 'none';
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
    });

    let searchInstances;
    searchInstanceInput.addEventListener('change', () => {
        searchInstanceInput.value = searchInstanceInput.value.replaceAll(
            ' ',
            ''
        );
        searchInstances = searchInstanceInput.value.split(',');
    });

    let file;
    let statuses;
    let id;
    let csvData = [];
    let skippedItems = 0;
    let sheet;
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
        resultsMsg.textContent = '';
        dlBtn.style.display = 'none';
        dlResult.textContent = '';
        resetBtn.style.display = 'none';
        try {
            await scrape();
            abortBtn.style.display = 'none';
            extractBtn.style.display = 'block';
            formatSelect.disabled = false;
            maxTootsInput.disabled = false;
            extractBtn.disabled = false;
            extractSpinner.style.display = 'none';
            tootCount = tootCount - 1;
            resultsMsg.textContent = tootCount + ' toot(s) extracted';
            if (skippedItems > 0) {
                const skippedItemsText = document.createTextNode(
                    ` — ${skippedItems} toot(s) ignored: too long for XLSX`
                );
                resultsMsg.appendChild(skippedItemsText);
            }
            dlBtn.textContent = 'Download ' + fileFormat.toUpperCase();
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
        } else if (fileFormat === 'xlsx') {
            file = XLSX.utils.book_new();
            sheet = XLSX.utils.aoa_to_sheet([
                ['ID', 'Username', 'Date', 'Time', 'URL', 'Text'],
            ]);
        }

        let p = 1;

        tootCount = 1;
        skippedItems = 0;

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
                    nextQueryUrl = new URL(queryUrl);
                    nextQueryUrl.searchParams.set('max_id', id.toString());
                    nextQueryUrl = nextQueryUrl.toString();
                }
                nextQueryUrl = nextQueryUrl + '&limit=40';
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
                if (
                    statuses.length == 0 ||
                    (tootCount > 1 && statuses.length <= 1)
                ) {
                    abort = true;
                }
                for (s of statuses) {
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

                    datetime = s.created_at;
                    if (fromDate && datetime < fromDate) {
                        abort = true;
                        break;
                    }
                    if (toDate && datetime > toDate) {
                        continue;
                    }

                    let sInstance = username.split('@')[1];
                    if (searchInstances && searchInstances.length > 0) {
                        if (!searchInstances.includes(sInstance)) {
                            continue;
                        }
                    }
                    date = datetime.split('T')[0];
                    time = datetime.split('T')[1].split('.')[0];
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
                    if (fileFormat === 'xlsx' && text.length > 32767) {
                        skippedItems++;
                        continue;
                    }
                    url = s.url;

                    if (fileFormat === 'xml') {
                        username = username
                            .replaceAll('&', '&amp;')
                            .replaceAll('<', '&lt;')
                            .replaceAll('>', '&gt;')
                            .replaceAll('"', '&quot;')
                            .replaceAll("'", '&apos;');
                        text = text
                            .replaceAll('&', '&amp;')
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
<toot id="${id}" username="${username}" date="${date}" time="${time}"><lb></lb>
<ref target="${url}">${url}</ref><lb></lb><lb></lb>
${text}
</toot>
<lb></lb><lb></lb>`;
                    } else if (fileFormat === 'txt') {
                        file = file + `\n\n${text}\n\n——————`;
                    } else if (fileFormat === 'json') {
                        text = text.replaceAll('\n', ' ');
                        file[id] = {
                            username: `${username}`,
                            date: `${date}`,
                            time: `${time}`,
                            url: `${url}`,
                            text: `${text}`,
                        };
                    } else if (fileFormat === 'csv') {
                        text = text.replaceAll('\n', ' ');
                        csvData.push({ username, date, time, url, text });
                    } else if (fileFormat === 'xlsx') {
                        text = text.replaceAll('\n', ' ');
                        let row = [id, username, date, time, url, text];
                        XLSX.utils.sheet_add_aoa(sheet, [row], { origin: -1 });
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
        dlResult.style.display = 'block';
        dlResult.textContent = fileFormat.toUpperCase() + ' file downloaded';
    });

    // Function to download output file
    function download() {
        try {
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
                    const rows = data.map((obj) =>
                        Object.values(obj).join('\t')
                    );
                    return [header, ...rows].join('\n');
                }
                const csvString = convertToCsv(csvData);
                var myBlob = new Blob([csvString], { type: 'text/csv' });
            } else if (fileFormat === 'xlsx') {
                XLSX.utils.book_append_sheet(file, sheet, 'Toots');
                XLSX.writeFile(file, 'toots.xlsx');
            }
            if (fileFormat !== 'xlsx') {
                var url = window.URL.createObjectURL(myBlob);
                var anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = `toots.${fileFormat}`;
                anchor.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error(error);
            window.alert(
                `${fileFormat.toUpperCase()} file creation failed. Try another output format.`
            );
            formatSelect.disabled = false;
            maxResultsInput.disabled = false;
            extractBtn.disabled = false;
            dlBtn.style.display = 'none';
            resetBtn.style.display = 'none';
            dlResult.textContent = '';
        }
    }

    // Assign role to reset button
    resetBtn.addEventListener('click', () => {
        const inputs = searchContainer.querySelectorAll('input');
        for (let input of inputs) {
            input.value = '';
        }
        location.reload();
    });
});
