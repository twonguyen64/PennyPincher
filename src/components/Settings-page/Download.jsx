import { exportDatabase } from "../../utils/db"
import { createSignal, Show } from "solid-js"
import { DB_NAME } from "../../utils/db";
import Dexie from "dexie";

export default function Download() {
    const [fileAdded, setFileAdded] = createSignal(false);
    const [databaseImported, setDatabaseImported] = createSignal(false)

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) setFileAdded(true);
        else setFileAdded(false);
    };

    async function getFileVersion(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
            try {
                const header = JSON.parse(event.target.result);
                resolve(header.data.databaseVersion);
            } catch (e) {
                reject(new Error("Not a Dexie export."));
            }
            };
            reader.onerror = reject;
            reader.readAsText(file.slice(0, 1024));
        });
    }

    async function loadDatabase() {
        const databaseInput = document.getElementById('importDB');
        if (databaseInput.files.length === 0) return;
        const databaseFile = databaseInput.files[0];

        try {
            const version = await getFileVersion(databaseFile)
            const db = new Dexie(DB_NAME); 
            db.version(version).stores({
                account: 'id',
                transactions: '++id',
                budgetExpenses: '++id',
                savingsGoals: '++id',
                settings: 'key',
                tags: '',
            });

            await db.import(databaseFile);
            console.log("Database imported!");
            setDatabaseImported(true)
        } catch (error) {
            console.error("Failed to import database:", error);
        }
        setFileAdded(false)
    }
    const clickImportDatabase = async () => {
        await loadDatabase(); 
    };
    return (
        <div id="download-wrapper">
            <Show when={databaseImported()}>
                Databased imported! Restart the app to see your changes.
            </Show>
            <Show when={!databaseImported()}>
                <button class="download-button" onClick={exportDatabase}>Download copy</button>
                <label for="importDB" class="download-button">Load database</label>
                <input 
                type="file" 
                id="importDB" 
                accept=".json" 
                class="hidden"
                onChange={handleFileChange}/>
                <Show when={fileAdded()}>
                    <button id='overwrite-db' onClick={clickImportDatabase}>Overwrite Database</button>
                </Show>
            </Show>
        </div>
    )
}