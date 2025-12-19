class Node {
  constructor(value) {
    this.prev = null;
    this.value = value;
    this.next = null;
  }
}

class DoubleLinkedList {
  constructor() {
    this.head = null;
    this.current = null;
    this.tail = null;
    this.size = 0;
  }

  add(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = this.tail = this.current = newNode;
      this.size++;
    }else{
        this.tail.next = newNode;
        newNode.prev= this.tail;
        this.tail = newNode;
        this.tail.next = this.head;
        this.head.prev = this.tail;
        this.size++;
        
    }
  }

  moveNext(){
    if(this.current && this.current.next){
     this.current = this.current.next;
    }
  }

  movePrev(){
    if(this.current && this.current.prev){
    this.current = this.current.prev;
  }
}

  getCurrent(){
     return this.current ? this.current.value : null;
  }

  getSize(){
    return this.size;
  }

}


export default DoubleLinkedList;
