# Go Study

## 참고할 만한 링크 

- 프로그래머스 : https://programmers.co.kr/learn/courses/13/lessons/621

## Methods 

- Go는 클래스를 가지지 않음 => 그와 같은 타입의 메소드를 정의할 수 있음 

- 그 메서드는 특별한 receiver 인자가 있는 함수 
    - receiver : func 키워드와 메서드 이름 사이의 자체 인수 목록에 나타남 

- ex) Abs 메소드에는 v라는 이름의 Vertex 유형의 리시버가 있음 
```go
func (v Vertex) Abs() float64 {
    return math.Sqrt(v.X*v.X + v.Y*v.Y)
}
```

- 메소드는 receiver 함수가 있는 함수 

- 구조체가 아닌 형식에 대해서도 메소드를 선언할 수 있음 

- ex) Abs 메소드가 있는 숫자 유형 MyFloat

- 메소드와 동일한 패키지에 유형이 정의된 수신자가 있는 메소드만 선언할 수 있음 

- 유형이 다른 패키지(int와 같은 빌트인 유형 포함)에 정의된 리시버로 메소드를 선언 불가 

```go
type MyFloat float64
func (f MyFloat) Abs() float64 {
    if f < 0 {
        return float64(-f)
    }
    return float64(f)
}
```

- 포인터 리시버 
    - 포인터 리시버로 메소드를 선언 가능 

    - 리시버 유형이 일부 유형 T에 대한 리터럴 구문 *T를 가짐을 의미 
        - T 자체는 *int와 같은 포인터가 될 수 없음 

    - Scale 방법은 *Vertex에 정의되어 있음 

        - 포인터 리시버가 있는 메소드는 Scale처럼 리시버가 가리키는 값을 수정할 수 있음 

        - 메소드는 종종 리시버를 수정해야 함 => 포인터 리시버가 값 수신기보다 더 일반적 

    - 값 수신기를 사용하면 Scale 메소드가 원래 Vertex 값의 복사본에서 작동함 
        - 다른 함수 인수와 동일하게 작동함 

- 메소드와 포인터 indirection

```go
var v Vertex 
ScaleFunc(v, 5) // Compile error!
ScaleFunc(&v, 5) // OK
```

- 포인터 리시버가 있는 메소드는 호출될 때 값이나 포인터를 리시버로 받아들임 
```go 
var v Vertex 
v.Scale(5) // OK
p := &v  
p.Scale(10) // OK
```
- 위의 코드 중, v.Scale(5)는 v가 포인터가 아니라 값인데도 포인터 리시버가 있는 메서드는 자동으로 호출됨 

```go
type Vertex struct {
    X, Y float64
}

func (v *Vertex) Scale(f float64) {
    v.X = v.X * f
    v.Y = v.Y * f
}
```

- 메소드와 포인터 indirection 
    - 역방향에서 일어날 수 있음 
    - 값 인수를 사용하는 함수는 특정 유형의 값을 사용해야 함 
    
    ```go
    var v Vertex 
    fmt.Println(AbsFunc(v)) // OK
    fmt.Println(AbsFunc(&v)) // Compile error!
    ```

    - value receiver 가 있는 메서드는 다음과 같이 호출될 떄, 값이나  포인터를 리시버로 사용함
    - 이 경우에, p.Abs() 라는 메서드는 (*p).Abs()로 해석됨  
    ```go 
    var v Vertex 
    fmt.Println(v.Abs()) // OK
    p := &v
    fmt.Println(p.Abs()) // OK
    ```
    ```go
    package main
    import (
        "fmt"
        "math"
    )

    type Vertex strcut {
        X, Y float64
    }

    func (v Vertex) Abs() float64 {

    }

    func AbsFunc(v Vertex) float64 {

    }

    func main() {
        v := Vertex{3,4}
        fmt.Println(v.Abs())
        fmt.Println(AbsFunc(v))

        p := &Vertex{4, 3}
        fmt.Println(p.Abs())
        fmt.Println(AbsFunc(*p))
    }
    ```
- 값 또는 포인터 리시버 선택 

    - 두 가지 이유가 존재 

    1. 메서드가 리시버가 가리키는 값을 수정할 수 있음 

    2. 각각의 메서드 call에서의 value 복사 문제를 피하기 위해서 

    - 리시버가 큰 구조체라면 이것은 더 효율적일 수 있음 

    - Abs 메서드는 리시버 방식을 수정할 필요가 없지만, Scale과 Abs는 모두 *Vertex 라는 리시버 타입으로 되어 있다면??

    - 일반적으로 특정 유형의 모든 방법에는 값이나 포인터 리시버가 있어야 함 => But, 둘 다 혼합되어서는 안 됨  


- Interfaces 

    - _interface_type_은 메소드의 시그니처 집합으로 정의됨 
    - 인터페이스 유형의 값은 해당 메소드를 구현하는 모든 값을 보유 가능 

    ```go

    import (
        "fmt"
        "math"
    )

    type Abser interface {
        Abs() float64
    }

    func main() {
        var a Abser
        f := MyFloat(-math.Sqrt2)
        v := Vertex{3, 4}

        a = f // a MyFloat implements Abser
        a = &v // a *Vertex implements Abser

        // v is a Vertex ( not a *Vertex)
        // and does NOT implemenet Abser 
        a = v // error happened 

        fmt.Println(a.Abs())
    }

    type MyFloat float64

    func (f MyFloat) Abs() float64{
        if f < 0 {
            return float64(-f)
        }
        return float64(f)
    }

    type Vertex struct {
        X, Y float64
    }

    func (v *Vertex) Abs() float64 {
        return math.Sqrt(v.X*v.X + v.Y*v.Y)
    }
    ```

    - 위의 코드 중, Vertex(값 유형)는 Abser를 구현하지 않음 
        - 왜? Abs 메소드는 *Vertex (포인터 유형)에서만 정의되기 때문

- 인터페이스의 암시적 구현 
    - type implements는 메소드를 실행함으로써, 인터페이스를 구현 
    - 명시적 intent의 선언도, implementation의 키워드도 없음 

    - 암시적 인터페이스는 인터페이스의 정의를 구현으로부터 분리 & 사전 정렬 없이 어떠한 패키지에 등장할 수 있음 

    ```go 
    type I interface {
        M()
    }

    type T struct {
        S string
    }

    // This method means type T implements the interface I
    // but we don't need to explicitly declare that it does so. 
    func (t T) M() {
        fmt.Println(t.S)
    }

    func main() {
         var i I = T{"hello"}
         i.M()
    }

    ```

- 인터페이스 값 

    - hood 아래에서, 인터페이스의 값은 값과 콘크리트 타입의 튜플이라고 생각할 수 있음 
    ```go
    (value, type)
    ```
    - 인터페이스 값은 특정 기초 콘크리트 유형의 가치를 가짐 
    - 인터페이스 값으로 메소드를 호출하면 기본 형식에 동일한 이름의 메서드가 실행됨 
    ```go
    import (
        "fmt"
        "math"
    )

    type I interface {
        M()
    }

    type T struct {
        S string
    }

    func (t *T) M() {
        fmt.Println(t.S)
    }

    type F float64 

    func (f F) M() {
        fmt.Println(f)
    }

    func main() {
        var i I 

        i = &T{"Hello"}
        describe(i)
        i.M()

        i = F(math.Pi)
        describe(i)
        i.M()
    }

    func describe(i I){
        fmt.Printf("(%v, %T)\n", i, i)
    }
    ```

- Nil 인터페이스 값 

    - 인터페이스 자체 내부의 콘크리트 값이 0일 경우, 그 메소드는 nil 리시버로 호출됨 

    - 일부 언어에선 이것이 null 포인터 예외를 발생시킴 
        - Go 에서는 nil 리시버로 호출되는 것으로 불리는 매우 좋은 방법을 사용하는 것이 일반적 
    
    - nil 콘크리트 값을 갖는 인터페이스 값 자체가 nil이 아니라는 점에 유의!!

    - Nil 인터페이스 값은 값 또는 콘크리트 유형 모두를 가지지 않음 

    - nil 인터페이스에서 메소드를 호출하는 것은 런타임 에러 
        - why? 어떠한 구체적인 메소드를 호출할지를 나타내는 인터페이스 튜플 내부의 타입이 없기 때문 


- 빈 인터페이스 값 
    - 0 메서드를 지칭하는 인터페이스 유형을 _emprt_interface_라고 함 
    ```go
    interface{}
    ```
    - 빈 인터페이스는 모든 유형의 값을 가질 수 있음 
    - 모든 유형은 최소 0개의 메소드를 구현 

    - 빈 인터페이스는 알 수 없는 값을 처리하는데 이용됨 
        - fmt.Print : interface{} 타입의 어떠한 인수라도 취할 수 있음 
         

- 타입 선언 
    - _type_assertion_은 인터페이스 값의 기초적인 콘크리트 값에 대한 접근을 제공 
    ```go
    t := i.(T)
    ```
    - 인터페이스 값 i가 콘크리트 타입 T를 가지고 있으며, 그 기본값인 T 값을 변수 t에 할당하고 있다고 선언 
    - 만약 i가 T를 갖지 못하면 그 선언은 panic 상태가 됨 

    - 인터페이스 값이 특정 유형을 보유하는지 여부를 test 하기 위해, 타입 선언에선 두 가지 값
        - 기본 값과 선언 성공 여부를 보고하는 부울 값을 반환할 수 있음 
    ```go
    t, ok:= i.(T)
    ```
    - 만약 i가 T를 갖고 있다면, t는 underlying value가 되며, ok가 true를 반환함 
    - 만약 그렇지 않다면, ok는 거짓이 되고, t는 T라는 유형의 zero 값이 되며 어떠한 패닉도 발생하지 않음 

    - map에서 읽는 구문 간 유사성에 주의!!!

- 타입 스위치 
    - 여러 타입의 선언을 직렬로 허용하는 구조
    - 일반 스위치 문과 같지만 타입 스위치 문의 경우엔 값이 아닌 타입을 명시 & 그 값들을 지정된 인터페이스 값에 의해 유지되는 값의 타입과 비교됨 
    ```go
    switch v := i.(type) {
        case T:
            // v has type T
        case S:
            // v has type S 
        default:
            // no match; here v has the same type as i
    }
    ```
    - 타입 스위치의 선언은 타입 선언 i.(T)와 같은 구문을 가짐 
        - 특정 타입인 T는 type이라는 키워드로 대체됨 

    - 이 스위치 문장 : 인터페이스 값 i가 T 형인지 S 형인지 시험함 
        - T와 S의 각각의 경우 변수 v는 각각 T형과 S형
        - i 형이 보유한 값을 보유하게 됨 
        - 디폴트 케이스(일치하지 않는 경우)에서 
            - 변수 v는 인터페이스 종류와 값이 i와 같음 

- Stringers 
    - 가장 널리 사용되는 인터페이스 중 하나
    - fmt 패키지에 의해 정의된 Stringer
    ```go
    type Stringer interface {
        String() string
    }
    ```
    - Stringer 는 자신을 문자열로 설명할 수 있는 타입
        - fmt 패키지 및 기타 여러 패키지는 값을 출력하기 위해 이 인터페이스를 사용함 

- Errors 

    - Go 프로그램 : 'error' 값으로 오류 상태를 표현 
    - error 타입은 fmt.Stringer와 유사한 내장 인터페이스 
    ```go
    type error interface {
        Error() string
    }
    ```
    - fmt.Stringer와 마찬가지로 fmt 패키지는 값을 출력할 때 error 인터페이스를 찾음 

    - 함수는 종종 error 값을 반환하며, 호출 코드는 오류가 nil과 같은지 테스트해 오류를 처리해야 함 
    ```go
    i, err := strconv.Atoi("42")
    if err != nil {
        fmt.Printf("couldn1t convert number: %v\n", err)
        return 
    }
    fmt.Println("Converted integer:", i)
    ```

    - nil error는 성공을 나타냄, nil이 아닌 error는 실패를 나타냄 

- Readers 
    - io 패키지 : 데이터 스트림의 읽기를 나타내는 io.Reader 인터페이스를 지정함 
    - Go 표준 라이브러리에는 파일, 네트워크 연결, 압축기, 암호 등을 포함해 인터페이스의 많은 구현이 포함됨 

    - io.Reader 인터페이스에는 Read 메소드가 존재 

    ```go
    func (T) Read(b []byte) (n int, err error)
    ```
    - Read는 주어진 바이트 조각을 데이터로 채우고 채워진 바이트 수와 오류 값을 반환함 
    - 스트림이 종료되면 io.EOF 오류를 반환함

- Concurrency (동시성)
    - Go 언어의 핵심 요소 : concurrency 특징을 제공함 
    - goroutine, channel, 다른 concurrency 패턴을 도입하기 위해 어떻게 사용되는가???

- Goroutines
    - goroutine : Go 런타임에 의해 관리되는 경량 쓰레드 

    - 새로운 goroutine을 시작합니다.
    ```go
    go f(x,y,z)

    f(x,y,z)
    ```
    - f와 x,y,z의 evaluation은 현재의 goroutine에서 일어나고, f의 실행은 새로운 goroutine에서 일어남 

    - goroutine은 같은 주소의 공간에서 실행됨 
        - 따라서, 공유된 메모리는 synchronous 해야함 
        - Go에 다른 기본형들이 존재하는 것처럼,
        - sync 패키지는 유용한 기본형을 제공함 

- Channel
    - 채널 연산자인 <- 을 통해 값을 주고 받을 수 잇는 하나의 분리된 통로 
    ```go
    ch <- v // 채널 ch에 v를 전송한다.
    v := <- ch // ch로 부터 값을 받고, 값을 v에 대입한다. 
    ```
    - 데이터는 화살표의 방향대로 흐름 
    - channel은 map과 slice처럼 사용하기 전에 생성되어야만 함 
    ```go
    ch := make(chan int)
    ```
    - 기본적으로 전송과 수신은 다른 한 쪽이 준비될 때까지 block 상태 
        - 명시적인 lock이나 조건 변수 없이 goroutine이 synchronous하게 작업될 수 있도록 함 

- Buffered Channels (버퍼가 있는 채널)
    - Channel은 buffered될 수 있음 
    - Buffered channel => channel이 버퍼를 가질 수 있다는 의미 
    - buffered channel을 초기화하기 위해 make에 두 번째 인자로 buffer 길이를 제공 
    ```go
    ch := make(chan int, 100)
    ```
    - buffered channel로의 전송은 그 buffer의 사이즈가 꽉 찼을 때만 block 됨 
    - buffer로 부터의 수신은 그 buffer가 비어있을 때 block 됨 

- Range와 Close
    - 전송자는 더 이상 보낼 데이터가 없다는 것을 암시하기 위해 channel을 close할 수 있음 
    - 수신자는 수신에 대한 표현에 두 번째 매개변수를 할당함으로써 채널이 닫혔는지 테스트할 수 있음 
    ```go
    v, ok := <-ch
    ```
    - 만약 더 수신할 값이 없고, channel이 닫혀있다면 ok는 false
    - for i := range c 반복문은 channel이 닫힐 때까지 반복해서 channel에서 값을 수신함 

    - 주의! 절대로 수신자가 아닌 전송자만이 channel을 닫아야함 
        - 닫힌 channel에 전송하는 것은 panic을 야기할 것
    
    - 주의! Channel은 파일과 다름. file과 달리 보통 channel을 닫을 필요는 없음
        - channel을 닫는 것은 range 반복문을 종료시키는 것과 같이 수신자가 더 이상 들어오는 값이 없다는 것을 알아야하는 경우에만 필요함 

- Select
    - Select문은 goroutine이 다중 커뮤니케이션 연산에서 대기할 수 있게 함 
    - select는 case들 중 하나가 실행될 때까지 block됨 
        - select문은 해당하는 case를 수행함
        - 만약 다수의 case가 준비되는 경우에는 select가 무작위로 하나를 선택함 

- Default Selection
    - select에서의 default case는 다른 case들이 모두 준비되지 않았을 때 실행됨 
    - block 없이 전송이나 수신을 수행하도록 default case를 사용해볼 수 있음 
    ```go
    select {
        case i := <-c:
            // use i
        default:
            // c로부터 값을 받아오는 것이 block된 경우 
    }
    ```

- sync.Mutex
    - 이러한 communication이 필요없다면??
    - 우리가 충돌을 피하기 위해 단순히 오직 하나의 goroutine만이 어떤 순간애 어떤 변수에 접근할 수 있도록 하고싶다면 어떨까?
        - mutual exclusion이라 부름 
    - 자료구조에서 관습적인 이름은 mutex
    
    - Go의 표준 라이브러리는 sync.Mutex와 그것의 두 가지 method를 통해 mutual exclusion을 제공함 
        - Lock, Unlock
    
    - 코드 블럭을 lock, unlock 호출로 감쌈으로써 mutual exclusion 속에서 수행될 코드 블럭을 정의 가능 

    - mutex가 unlocked 될 것이라는 것을 확실히 하기 위해 defer을 사용할 수도 있음 


    


