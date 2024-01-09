import { field, FieldOpts, fk, id, index, table, TableOpts } from 'sqlite3orm';

@table({ name: 'Benutzer', autoIncrement: true })
export class User {
    @id({ name: 'ID', dbtype: 'INTEGER PRIMARY KEY' })
    userId;

    @field({ name: 'Benutzername', dbtype: 'TEXT NOT NULL' })
    userLoginName;

    @field({ name: 'Passwort', dbtype: 'TEXT'})
    userJsonData;

    @field({ name: 'userlevel', dbtype: 'INTEGER DEFAULT 0' })
    deleted;
}

@table({ name: 'Jobs' })
export class Jobs {
    @field({name: 'uniqueID', dbtype: 'TEXT NOT NULL'})
    uniqueID;

    @field({name: 'Kommentar', dbtype: 'TEXT'})
    kommentar;

    @field({name: 'Date', dbtype: 'TEXT'})
    Date;

    @field({name: 'ID', dbtype: 'INTEGER NOT NULL'})
    @fk('fk_user_id', 'Benutzer', 'ID')
    @index('idx_contacts_user')
    userId;
    
    @field({name: 'Status', dbtype: 'TEXT'})
    status;

    @field({name: 'progress', dbtype: 'INTEGER'})
    progress;
}

@table({ name: 'Log', autoIncrement: true })
export class Log {

    @id({ name: 'ID', dbtype: 'INTEGER PRIMARY KEY' })
    logId;

    @field({name: 'Logmessage', dbtype: 'TEXT'})
    logmessage;


    @field({name: 'jobID', dbtype: 'INTEGER NOT NULL'})
    @fk('fk_job_id', 'Jobs', '  ID')
    @index('idx_contacts_user')
    aufgabeID;

    @field({name: 'Logtime', dbtype: 'TEXT'})
    logtime;

    @field({name: 'LogLevel', dbtype: 'TEXT'})
    logLevel;
    
    @field({name: 'LogArt', dbtype: 'INTEGER'})
    logart;
}