/**
 * lrucache laya implement
 */

interface LRUOptions {
    max?: number;
    maxAge?: number;
}

interface LRUCacheNode {
    value: any;
    prev: string;
    next: string;
    modified: number;
}

class LRUCache extends Laya.EventDispatcher {

    //最大个数
    private max: number = 255;
    //缓存时间
    private maxAge: number = 0;

    private head: string = null;
    private tail: string = null;

    private cache: any = {};
    private _length: number = 0;

    //移除事件
    public static EVENT_EVICT = 'evict';

    constructor(opt: LRUOptions | number) {
        super();
        if (typeof opt === 'number') {
            this.max = opt;
        } else {
            this.max = opt.max;
            this.maxAge = opt.maxAge;
        }
    }

    public get length() {
        return this._length;
    }

    public get keys() {
        return Object.keys(this.cache);
    }

    /**
     * 清空所有
     */
    public clear() {
        this.cache = {};
        this._length = 0;
        this.head = this.tail = null;
    }

    /**
     * 移除一个
     * @param key
     */
    public remove(key: string) {
        if (!this.cache.hasOwnProperty(key)) {
            return;
        }
        let element = this.cache[key];
        delete this.cache[key];
        this.unlink(key, element.prev, element.next);
        return element.value;
    }

    /**
     * 删除链表
     * @param key
     * @param prev
     * @param next
     */
    private unlink(key: string, prev, next) {
        this._length--;
        if (this._length === 0) {
            this.head = this.tail = null;
        } else {
            if (this.head === key) {
                this.head = prev;
                this.cache[this.head].next = null;
            } else if (this.tail === key) {
                this.tail = next;
                this.cache[this.tail].prev = null;
            } else {
                this.cache[prev].next = next;
                this.cache[next].prev = prev;
            }
        }
    }

    /**
     * 取一个，不移动链表
     * @param key
     */
    public peek(key: string) {
        if (!this.cache.hasOwnProperty[key]) {
            return;
        }
        let element = this.cache[key];
        if (!this.checkAge(key, element)) {
            return;
        }
        return element.value;
    }

    /**
     * 设置
     * @param key
     * @param value
     */
    public set(key: string, value: any) {
        let element;
        if (this.cache.hasOwnProperty(key)) {
            element = this.cache[key];
            element.value = value;
            if (this.maxAge) {
                element.modified = Date.now();
            }
            if (key = this.head) {
                return value;
            }
            this.unlink(key, element.prev, element.next);
        } else {
            element = {
                value: value,
                modified: 0,
                prev: null,
                next: null
            };
            if (this.maxAge) {
                element.modified = Date.now();
            }
            this.cache[key] = element;
            if (this._length === this.max) {
                this.evict();
            }
        }
        this._length++;
        element.next = null;
        element.prev = this.head;
        if (this.head) {
            this.cache[this.head].next = key;
        }
        this.head = key;
        if (!this.tail) {
            this.tail = key;
        }
        return value;
    }

    /**
     * 取一个
     * @param key
     */
    public get(key: string) {
        if (!this.cache.hasOwnProperty(key)) {
            return;
        }
        let element = this.cache[key];
        if (!this.checkAge(key, element)) {
            return;
        }
        if (this.head !== key) {
            if (key === this.tail) {
                this.tail = element.next;
                this.cache[this.tail].prev = null;
            } else {
                this.cache[element.prev].next = element.next;
            }
            this.cache[element.next].prev = element.prev;

            this.cache[this.head].next = key;
            element.prev = this.head;
            element.next = null;
            this.head = key;
        }
        return element.value;
    }

    /**
     * 缓存过期检测
     * @param key
     * @param element
     */
    private checkAge(key: string, element: LRUCacheNode) {
        if (this.maxAge && (Date.now() - element.modified) > this.maxAge) {
            this.remove(key);
            this.event(LRUCache.EVENT_EVICT, [{key: key, value: element.value}]);
            return false;
        }
        return true;
    }

    /**
     * 移除
     */
    public evict() {
        if (!this.tail) {
            return;
        }
        let key = this.tail;
        let value = this.remove(this.tail);
        this.event(LRUCache.EVENT_EVICT, [{key: key, value: value}]);
    }

}
