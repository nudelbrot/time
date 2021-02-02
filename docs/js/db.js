class Vault {
  constructor(key) {
    this.key = key;
    this.keys = undefined;
    this.data = undefined;
    if (localStorage.getItem(key) === null){
      localStorage.setItem(key, "{}");
      this.keys = [];
    }
    this.load();
  }

  load(){
    this.data = JSON.parse(localStorage.getItem(this.key));
    this.keys = [];
    for(let key in this.data){
      this.keys.push(key);
    }
  }

  save(){
    localStorage.setItem(this.key, JSON.stringify(this.data));
  }

  put(key, value){
    this.load();
    this.data[key] = value;
    this.save();
    this.load();
  }

  pull(key, fallback){
    this.load();
    if (key in this.data){
      return this.data[key];
    }
    return fallback;
  }

  exists(key){
    this.load();
    return key in this.data;
  }

  delete(key){
    this.load();
    if (key in this.data){
      delete this.data[key];
    }
    this.save();
    this.load();
  }

  size(){
    return this.keys.length;
  }
}

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
        window.vault.put(this.name, this);
    }

    save_to_file(){

    }

    load(){
        if (!window.vault.exists(this.name)){
          return;
        }
        let dump = window.vault.pull(this.name, {"data": [], "counter": 0});
        this.data = dump.data;
        this.counter = dump.counter;
    }

    load_from_file(){

    }
}

window.vault = new Vault("nudelbrot.time");

