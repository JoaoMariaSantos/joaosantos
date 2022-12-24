export class Post {
    constructor(title, year, tags, gallery, url) {
        this.title = title;
        this.year = year;
        this.tags = tags;
        this.gallery = gallery;
        this.url = url;
    }

    get _title() {
        return this.title;
    }

    get _year() {
        return this.year;
    }

    get _tags() {
        return this.tags;
    }

    get _gallery() {
        return this.gallery;
    }

    get _url() {
        return this.url;
    }
}