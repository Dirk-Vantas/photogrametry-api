"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.Jobs = exports.User = void 0;
const sqlite3orm_1 = require("sqlite3orm");
let User = (() => {
    let _classDecorators = [(0, sqlite3orm_1.table)({ name: 'Benutzer', autoIncrement: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userLoginName_decorators;
    let _userLoginName_initializers = [];
    let _userpassword_decorators;
    let _userpassword_initializers = [];
    let _userlevel_decorators;
    let _userlevel_initializers = [];
    var User = _classThis = class {
        constructor() {
            this.userId = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.userLoginName = __runInitializers(this, _userLoginName_initializers, void 0);
            this.userpassword = __runInitializers(this, _userpassword_initializers, void 0);
            this.userlevel = __runInitializers(this, _userlevel_initializers, void 0);
        }
    };
    __setFunctionName(_classThis, "User");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _userId_decorators = [(0, sqlite3orm_1.id)({ name: 'ID', dbtype: 'INTEGER PRIMARY KEY' })];
        _userLoginName_decorators = [(0, sqlite3orm_1.field)({ name: 'Benutzername', dbtype: 'TEXT NOT NULL' })];
        _userpassword_decorators = [(0, sqlite3orm_1.field)({ name: 'Passwort', dbtype: 'TEXT' })];
        _userlevel_decorators = [(0, sqlite3orm_1.field)({ name: 'userlevel', dbtype: 'INTEGER DEFAULT 0' })];
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _userLoginName_decorators, { kind: "field", name: "userLoginName", static: false, private: false, access: { has: obj => "userLoginName" in obj, get: obj => obj.userLoginName, set: (obj, value) => { obj.userLoginName = value; } }, metadata: _metadata }, _userLoginName_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _userpassword_decorators, { kind: "field", name: "userpassword", static: false, private: false, access: { has: obj => "userpassword" in obj, get: obj => obj.userpassword, set: (obj, value) => { obj.userpassword = value; } }, metadata: _metadata }, _userpassword_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _userlevel_decorators, { kind: "field", name: "userlevel", static: false, private: false, access: { has: obj => "userlevel" in obj, get: obj => obj.userlevel, set: (obj, value) => { obj.userlevel = value; } }, metadata: _metadata }, _userlevel_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
})();
exports.User = User;
let Jobs = (() => {
    let _classDecorators = [(0, sqlite3orm_1.table)({ name: 'Jobs' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _uniqueID_decorators;
    let _uniqueID_initializers = [];
    let _kommentar_decorators;
    let _kommentar_initializers = [];
    let _Date_decorators;
    let _Date_initializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _progress_decorators;
    let _progress_initializers = [];
    var Jobs = _classThis = class {
        constructor() {
            this.uniqueID = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _uniqueID_initializers, void 0));
            this.kommentar = __runInitializers(this, _kommentar_initializers, void 0);
            this.Date = __runInitializers(this, _Date_initializers, void 0);
            this.userId = __runInitializers(this, _userId_initializers, void 0);
            this.status = __runInitializers(this, _status_initializers, void 0);
            this.progress = __runInitializers(this, _progress_initializers, void 0);
        }
    };
    __setFunctionName(_classThis, "Jobs");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _uniqueID_decorators = [(0, sqlite3orm_1.field)({ name: 'uniqueID', dbtype: 'TEXT NOT NULL' })];
        _kommentar_decorators = [(0, sqlite3orm_1.field)({ name: 'Kommentar', dbtype: 'TEXT' })];
        _Date_decorators = [(0, sqlite3orm_1.field)({ name: 'Date', dbtype: 'TEXT' })];
        _userId_decorators = [(0, sqlite3orm_1.field)({ name: 'ID', dbtype: 'INTEGER NOT NULL' }), (0, sqlite3orm_1.fk)('fk_user_id', 'Benutzer', 'ID'), (0, sqlite3orm_1.index)('idx_contacts_user')];
        _status_decorators = [(0, sqlite3orm_1.field)({ name: 'Status', dbtype: 'TEXT' })];
        _progress_decorators = [(0, sqlite3orm_1.field)({ name: 'progress', dbtype: 'INTEGER' })];
        __esDecorate(null, null, _uniqueID_decorators, { kind: "field", name: "uniqueID", static: false, private: false, access: { has: obj => "uniqueID" in obj, get: obj => obj.uniqueID, set: (obj, value) => { obj.uniqueID = value; } }, metadata: _metadata }, _uniqueID_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _kommentar_decorators, { kind: "field", name: "kommentar", static: false, private: false, access: { has: obj => "kommentar" in obj, get: obj => obj.kommentar, set: (obj, value) => { obj.kommentar = value; } }, metadata: _metadata }, _kommentar_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _Date_decorators, { kind: "field", name: "Date", static: false, private: false, access: { has: obj => "Date" in obj, get: obj => obj.Date, set: (obj, value) => { obj.Date = value; } }, metadata: _metadata }, _Date_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _progress_decorators, { kind: "field", name: "progress", static: false, private: false, access: { has: obj => "progress" in obj, get: obj => obj.progress, set: (obj, value) => { obj.progress = value; } }, metadata: _metadata }, _progress_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Jobs = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Jobs = _classThis;
})();
exports.Jobs = Jobs;
let Log = (() => {
    let _classDecorators = [(0, sqlite3orm_1.table)({ name: 'Log', autoIncrement: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _logId_decorators;
    let _logId_initializers = [];
    let _logmessage_decorators;
    let _logmessage_initializers = [];
    let _aufgabeID_decorators;
    let _aufgabeID_initializers = [];
    let _logtime_decorators;
    let _logtime_initializers = [];
    let _logLevel_decorators;
    let _logLevel_initializers = [];
    let _logart_decorators;
    let _logart_initializers = [];
    var Log = _classThis = class {
        constructor() {
            this.logId = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _logId_initializers, void 0));
            this.logmessage = __runInitializers(this, _logmessage_initializers, void 0);
            this.aufgabeID = __runInitializers(this, _aufgabeID_initializers, void 0);
            this.logtime = __runInitializers(this, _logtime_initializers, void 0);
            this.logLevel = __runInitializers(this, _logLevel_initializers, void 0);
            this.logart = __runInitializers(this, _logart_initializers, void 0);
        }
    };
    __setFunctionName(_classThis, "Log");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _logId_decorators = [(0, sqlite3orm_1.id)({ name: 'ID', dbtype: 'INTEGER PRIMARY KEY' })];
        _logmessage_decorators = [(0, sqlite3orm_1.field)({ name: 'Logmessage', dbtype: 'TEXT' })];
        _aufgabeID_decorators = [(0, sqlite3orm_1.field)({ name: 'jobID', dbtype: 'INTEGER NOT NULL' }), (0, sqlite3orm_1.fk)('fk_job_id', 'Jobs', '  ID'), (0, sqlite3orm_1.index)('idx_contacts_user')];
        _logtime_decorators = [(0, sqlite3orm_1.field)({ name: 'Logtime', dbtype: 'TEXT' })];
        _logLevel_decorators = [(0, sqlite3orm_1.field)({ name: 'LogLevel', dbtype: 'TEXT' })];
        _logart_decorators = [(0, sqlite3orm_1.field)({ name: 'LogArt', dbtype: 'INTEGER' })];
        __esDecorate(null, null, _logId_decorators, { kind: "field", name: "logId", static: false, private: false, access: { has: obj => "logId" in obj, get: obj => obj.logId, set: (obj, value) => { obj.logId = value; } }, metadata: _metadata }, _logId_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _logmessage_decorators, { kind: "field", name: "logmessage", static: false, private: false, access: { has: obj => "logmessage" in obj, get: obj => obj.logmessage, set: (obj, value) => { obj.logmessage = value; } }, metadata: _metadata }, _logmessage_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _aufgabeID_decorators, { kind: "field", name: "aufgabeID", static: false, private: false, access: { has: obj => "aufgabeID" in obj, get: obj => obj.aufgabeID, set: (obj, value) => { obj.aufgabeID = value; } }, metadata: _metadata }, _aufgabeID_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _logtime_decorators, { kind: "field", name: "logtime", static: false, private: false, access: { has: obj => "logtime" in obj, get: obj => obj.logtime, set: (obj, value) => { obj.logtime = value; } }, metadata: _metadata }, _logtime_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _logLevel_decorators, { kind: "field", name: "logLevel", static: false, private: false, access: { has: obj => "logLevel" in obj, get: obj => obj.logLevel, set: (obj, value) => { obj.logLevel = value; } }, metadata: _metadata }, _logLevel_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _logart_decorators, { kind: "field", name: "logart", static: false, private: false, access: { has: obj => "logart" in obj, get: obj => obj.logart, set: (obj, value) => { obj.logart = value; } }, metadata: _metadata }, _logart_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Log = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Log = _classThis;
})();
exports.Log = Log;
module.exports = { User, Jobs, Log };
