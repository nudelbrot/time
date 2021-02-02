class Entry {
    constructor(id, timestamp, comment) {
        this.id = id;
        let parsed = Date.parse(timestamp)
        if (isNaN(parsed)) {
            this.timestamp = (new Date()).toISOString();
        } else {
            this.timestamp = (new Date(timestamp)).toISOString();
        }
        this.comment = comment;
    }
}
            
class Database {
    constructor(name, data){
        this.name = name || "";
        this.data = data || [];
        this.counter = 0;
    }

    insert(entry){
        entry.id = this.counter++;
        this.data.push(entry);
        this.save();
    }

    get(clause){
        let candidates = this.data.filter(clause);
        return candidates;
    }

    remove(clause){
        let candidates = this.get(clause);
        for (let candidate of candidates){
            this.data.splice(this.data.indexOf(candidate), 2);
        }
        this.save();
    }

    save(){
        localStorage[this.name] = JSON.stringify(this);
    }

    save_to_file(){

    }

    load(){
        if (localStorage.getItem(this.name) === null){
            return;
        }
        let dump = JSON.parse(localStorage[this.name]);
        this.data = dump.data;
        this.counter = dump.counter;
    }

    load_from_file(){

    }
}
