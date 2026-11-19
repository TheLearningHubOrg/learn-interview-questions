# Spring Boot 3, Spring Data JPA & Microservices Master Interview Bank (1 - 35)

> Comprehensive, production-grade technical interview questions covering Spring Boot 3, Dependency Injection, Bean Lifecycle, Spring Data JPA, Hibernate Caching, Spring Security 6, Kafka Integration, Distributed Tracing, and Microservices Architecture.

---

## Part 1: Spring Core, Auto-Configuration & Architecture (1 - 10)

### 1. What is Inversion of Control (IoC) and Dependency Injection (DI) in Spring?
**In Simple Words:**
- **Inversion of Control (IoC)**: Instead of a class instantiating its dependencies with `new OrderRepository()`, control of object lifecycle and creation is inverted and delegated to the Spring IoC Container (`ApplicationContext`).
- **Dependency Injection (DI)**: The mechanism where the IoC container injects dependent objects into a bean at runtime.
- **Best Practice**: Constructor injection with `final` fields because it guarantees immutability, facilitates unit testing without mocking Spring, and prevents `NullPointerException`.

```java
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    // Constructor Injection (Preferred over field injection @Autowired)
    public OrderService(OrderRepository orderRepository, NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.notificationService = notificationService;
    }
}
```

---

---

### 2. What are Spring Bean Scopes?
**In Simple Words:**
- **singleton (Default)**: Exactly one instance per Spring IoC container. Stateless, thread-safe design is mandatory.
- **prototype**: A new instance is created every time the bean is requested from the container.
- **request**: One instance per HTTP request lifecycle (Web-aware).
- **session**: One instance per HTTP session lifecycle (Web-aware).
- **application**: One instance per `ServletContext`.

```java
@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class ReportGenerator {
    // New instance created per request
}
```

---

---

### 3. Walk through the Spring Bean Lifecycle.
**In Simple Words:**
1. **Instantiation**: JVM creates bean instance via constructor.
2. **Populate Properties**: Dependencies injected via setters/constructors.
3. **Aware Interfaces**: Spring injects container references (`BeanNameAware`, `ApplicationContextAware`).
4. **BeanPostProcessor (Before Init)**: `postProcessBeforeInitialization` called.
5. **Initialization**: `@PostConstruct` method, followed by `InitializingBean.afterPropertiesSet()`, followed by custom `initMethod`.
6. **BeanPostProcessor (After Init)**: `postProcessAfterInitialization` (AOP proxies created here).
7. **Ready for Use**: Bean is live and serves traffic.
8. **Destruction**: `@PreDestroy` method, followed by `DisposableBean.destroy()`.

---

---

### 4. How does Spring Boot Auto-Configuration (`@EnableAutoConfiguration`) work?
**In Simple Words:**
Spring Boot scans dependencies on the classpath and automatically registers pre-configured beans unless you define your own:
1. `@SpringBootApplication` meta-annotates `@EnableAutoConfiguration`.
2. Loads configuration classes declared in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
3. Evaluates conditional annotations:
   - `@ConditionalOnClass(DataSource.class)`
   - `@ConditionalOnMissingBean(DataSource.class)`
   - `@ConditionalOnProperty(name = "feature.enabled", havingValue = "true")`

---

---

### 5. What is the difference between `@Component`, `@Service`, `@Repository`, and `@Controller`?
**In Simple Words:**
All are Spring stereotype annotations that inherit from `@Component` for classpath scanning, but provide semantic clarity:
- `@Component`: Generic Spring-managed component.
- `@Service`: Marks business logic layer.
- `@Repository`: Marks data access layer. Automatically enables database exception translation (`PersistenceExceptionTranslationPostProcessor` converts vendor SQL exceptions into Spring's `DataAccessException` hierarchy).
- `@Controller` / `@RestController`: Marks HTTP web entrypoints. `@RestController` combines `@Controller` + `@ResponseBody`.

---

---

### 6. How does Spring AOP work, and how does `@Transactional` leverage dynamic proxies?
**In Simple Words:**
Spring AOP (Aspect-Oriented Programming) intercepts method execution using **Dynamic Proxies** (CGLIB class-based or JDK dynamic interface-based).
When a class has `@Transactional`:
1. Spring generates a proxy wrapper around the target bean.
2. The caller invokes the proxy's method.
3. The proxy opens a database transaction (`connection.setAutoCommit(false)`).
4. The proxy executes your method inside a `try-catch` block.
5. If successful, it commits (`connection.commit()`). If a `RuntimeException` occurs, it rolls back (`connection.rollback()`).
6. **Gotcha**: Calling an `@Transactional` method internally from within the same class bypasses the proxy, meaning transaction management will NOT run.

---

---

### 7. How do you handle Global Exceptions in Spring Boot REST APIs?
**In Simple Words:**
Use `@RestControllerAdvice` and `@ExceptionHandler` to intercept exceptions across all controllers and return standardized RFC-7807 `ProblemDetail` or structured error payloads.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Resource Not Found");
        problem.setProperty("timestamp", Instant.now());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problem);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
}
```

---

---

### 8. What is Spring Boot Actuator, and how do you configure it in production?
**In Simple Words:**
Spring Boot Actuator provides production-ready monitoring endpoints (`/actuator/health`, `/actuator/metrics`, `/actuator/prometheus`).
- In production, never expose all endpoints publicly.
- Expose only `health` and `prometheus` metrics to internal monitoring tools.
- Protect sensitive endpoints with Spring Security.

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: "health,info,prometheus"
  endpoint:
    health:
      show-details: when-authorized
      probes:
        enabled: true # Kubernetes liveness and readiness probes
```

---

---

### 9. How do Spring Profiles work, and how do you separate environments?
**In Simple Words:**
Spring Profiles segregate application configuration for different target environments (`dev`, `staging`, `prod`):
- Uses naming convention: `application-dev.yml`, `application-prod.yml`.
- Activated via system environment variable: `SPRING_PROFILES_ACTIVE=prod`.
- Beans can be conditionally loaded using `@Profile("prod")`.

---

---

### 10. How do you implement asynchronous execution with `@Async` in Spring?
**In Simple Words:**
Annotating a method with `@Async` runs it in a separate background thread from a dedicated thread pool:
1. Must enable with `@EnableAsync`.
2. Must configure a custom `ThreadPoolTaskExecutor` (avoid default `SimpleAsyncTaskExecutor` which creates a new unbounded thread per task).
3. The method must be `public` and called from an external bean to pass through the AOP proxy.

```java
@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("AsyncWorker-");
        executor.initialize();
        return executor;
    }
}
```

---

---


---

## Part 2: Persistence, Transactions & Security (11 - 24)

### 11. What is the difference between `@RequestParam`, `@PathVariable`, and `@RequestBody`?
**In Simple Words:**
- `@PathVariable`: Extracts values from URI template path (e.g., `/orders/{id}` -> `@PathVariable UUID id`).
- `@RequestParam`: Extracts query parameters (e.g., `/orders?status=active&page=2` -> `@RequestParam String status`).
- `@RequestBody`: Deserializes JSON HTTP payload into a Java POJO/Record using Jackson.

---

---

### 12. What is `@ConfigurationProperties` and how is it superior to `@Value`?
**In Simple Words:**
- `@Value`: Weakly typed, error-prone SpEL string injections (e.g. `@Value("${app.timeout}") private int timeout;`).
- `@ConfigurationProperties`: Strongly typed, supports hierarchical YAML binding, validation via `@Validated`, and IDE autocomplete.

```java
@ConfigurationProperties(prefix = "app.payment")
@Validated
public record PaymentConfig(
    @NotBlank String gatewayUrl,
    @Positive int timeoutMs,
    boolean mockEnabled
) {}
```

---

---

### 13. What are Spring Events and how do you implement loose coupling?
**In Simple Words:**
Spring Events allow components to communicate asynchronously without direct dependencies:
1. Publisher calls `ApplicationEventPublisher.publishEvent(new OrderCreatedEvent(order))`.
2. Consumer listens via `@EventListener` or `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)`.
3. `AFTER_COMMIT` guarantees emails/Kafka events are only fired if the database transaction committed successfully.

---

---

### 14. How do you prevent and resolve circular dependencies in Spring Boot?
**In Simple Words:**
A circular dependency occurs when Bean A requires Bean B, and Bean B requires Bean A:
1. **Best Fix (Architectural)**: Refactor code to extract shared logic into a third service (Bean C).
2. **Event-driven**: Replace direct call with Spring ApplicationEvent.
3. **Lazy initialization**: Annotate one injection with `@Lazy`, causing Spring to inject a proxy rather than fully initializing both simultaneously.
4. Note: Spring Boot 2.6+ disables circular references by default.

---

---

### 15. How do you implement graceful shutdown in Spring Boot on Kubernetes?
**In Simple Words:**
When Kubernetes terminates a pod, it sends a `SIGTERM` signal:
1. Configure `server.shutdown: graceful`.
2. Set timeout `spring.lifecycle.timeout-per-shutdown-phase: 30s`.
3. Spring stops accepting new HTTP traffic and allows in-flight requests and background jobs up to 30 seconds to finish before terminating.

---

---

### 16. What is the N+1 Query Problem in JPA/Hibernate, and how do you solve it?
**In Simple Words:**
- **Problem**: Fetching 100 `Order` records issues 1 SQL query. Then accessing `order.getCustomer()` inside a loop issues 100 additional SQL queries (1 + N = 101 queries), destroying database performance.
- **Solutions**:
  1. **`JOIN FETCH` in JPQL**: `SELECT o FROM Order o JOIN FETCH o.customer` fetches parent and children in 1 query.
  2. **EntityGraph**: `@EntityGraph(attributePaths = {"customer"})`.
  3. **Batch Size**: `@BatchSize(size = 25)` on the relation to load related entities using SQL `WHERE id IN (?, ?, ...)`.

```java
public interface OrderRepository extends JpaRepository<Order, UUID> {
    // Solves N+1 by fetching related Customer in a single SQL JOIN:
    @Query("SELECT o FROM Order o JOIN FETCH o.customer WHERE o.status = :status")
    List<Order> findAllWithCustomerByStatus(@Param("status") String status);
}
```

---

---

### 17. What are Hibernate First-Level and Second-Level Caches?
**In Simple Words:**
- **First-Level Cache (L1)**: Bound to the `EntityManager` / `Session` lifecycle. Always enabled. If you query the same entity ID twice within the same transaction, Hibernate returns the in-memory reference without hitting the database.
- **Second-Level Cache (L2)**: Shared across all sessions and transactions at the `EntityManagerFactory` level (e.g. Ehcache, Redis, Hazelcast). Caches entity data across multiple transactions. Disabled by default.

---

---

### 18. What are JPA Cascade Types and Orphan Removal?
**In Simple Words:**
- `cascade = CascadeType.ALL`: Propagates entity operations (`PERSIST`, `MERGE`, `REMOVE`) from parent to children (e.g. saving `Order` automatically saves all `OrderItem` records).
- `orphanRemoval = true`: If a child entity is removed from the parent's collection (`order.getItems().remove(item)`), JPA automatically executes an SQL `DELETE` for that orphaned child.

```java
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private List<OrderItem> items = new ArrayList<>();
```

---

---

### 19. How does `@Transactional` propagation work (`REQUIRED` vs `REQUIRES_NEW`)?
**In Simple Words:**
- `REQUIRED (Default)`: Joins the existing transaction if one exists; creates a new one if none exists. If the inner method throws an exception, the entire outer transaction rolls back.
- `REQUIRES_NEW`: Suspends the existing outer transaction and always starts an independent, new physical transaction. If the inner transaction fails, it rolls back without failing the outer transaction (unless the exception is propagated). Perfect for audit logging.

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void writeAuditLog(String action) {
    auditRepository.save(new AuditEntry(action)); // Committed even if calling business transaction fails
}
```

---

---

### 20. How do Optimistic and Pessimistic Locking work in JPA?
**In Simple Words:**
- **Optimistic Locking**: Assumes low conflict. Uses a `@Version` number column. When updating, SQL checks `WHERE id = ? AND version = ?`. If another transaction incremented the version, an `OptimisticLockException` is thrown. No database locks held.
- **Pessimistic Locking**: Assumes high conflict. Uses database row locks (`SELECT ... FOR UPDATE` via `LockModeType.PESSIMISTIC_WRITE`). Other transactions block until the lock is released.

```java
@Entity
public class Account {
    @Id private UUID id;
    private BigDecimal balance;

    @Version // Optimistic Lock
    private Long version;
}

public interface AccountRepository extends JpaRepository<Account, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.id = :id")
    Optional<Account> findByIdForUpdate(@Param("id") UUID id);
}
```

---

---

### 21. What is the difference between `findById()` and `getReferenceById()` in Spring Data JPA?
**In Simple Words:**
- `findById()`: Immediately issues an SQL `SELECT` to fetch the entity and initialize all eager properties. Returns `Optional<T>`.
- `getReferenceById()`: Returns a lazy Hibernate proxy without hitting the database. The SQL query is only executed when a property (other than the ID) is accessed. Useful when setting a foreign key relation without needing to load the entire referenced entity.

---

---

### 22. What is Dirty Checking in Hibernate?
**In Simple Words:**
When an entity is loaded inside an `@Transactional` method, Hibernate stores a snapshot of its state in the L1 cache. When the transaction commits, Hibernate compares the entity's current state with the initial snapshot. If any fields changed, Hibernate automatically generates and executes the SQL `UPDATE` statement. You do NOT need to call `repository.save()`.

---

---

### 23. How does HikariCP connection pooling work and how do you size it?
**In Simple Words:**
HikariCP is Spring Boot's default ultra-fast, zero-overhead JDBC connection pool:
- Formula: `Pool Size = 2 * (CPU Cores) + Effective Spindle Count`.
- On a 4-core database server with fast SSDs: A pool of 10–20 connections outperforms a pool of 200 connections, because excessive connections waste CPU on context switching and lock contention.

---

---

### 24. What is Flyway or Liquibase and why use them over `ddl-auto=update`?
**In Simple Words:**
- Never use `hibernate.ddl-auto=update` in production: it cannot rename columns, cannot handle complex data transformations, and can inadvertently drop constraints.
- **Flyway**: Executes versioned SQL migration scripts (`V1__init.sql`, `V2__add_status.sql`) sequentially, tracking executed migrations in a `flyway_schema_history` table, guaranteeing repeatable, deterministic database schema across all environments.

---

---


---

## Part 3: Microservices, Distributed Systems & Observability (25 - 35)

### 25. What is the difference between Embedded IDs and IdClass in JPA?
**In Simple Words:**
Both represent composite primary keys in JPA:
- `@EmbeddedId`: Defines a separate `@Embeddable` class instance inside the entity (`@EmbeddedId private OrderItemId id;`). Clean and object-oriented.
- `@IdClass`: Annotates the entity with `@IdClass(OrderItemId.class)` and duplicates the primary key fields directly in the entity class.

---

---

### 26. Walk through the Spring Security 6 filter chain architecture.
**In Simple Words:**
Spring Security intercepts HTTP requests using `SecurityFilterChain` (a `DelegatingFilterProxy` managing a chain of filters):
1. `CorsFilter` & `CsrfFilter` validate cross-origin headers and tokens.
2. `JwtAuthenticationFilter` extracts `Bearer <token>` from the `Authorization` header.
3. `AuthenticationManager` validates credentials and sets `Authentication` in `SecurityContextHolder`.
4. `AuthorizationFilter` checks roles/authorities (`hasRole('ADMIN')`).

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/actuator/health").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

---

---

### 27. How do you implement Stateless JWT Authentication in Spring Boot 3?
**In Simple Words:**
1. User logs in with username/password via `/api/auth/login`.
2. Server validates credentials and signs a JWT (containing user ID, roles, expiration) using HMAC-SHA256 or RSA.
3. Client stores token and sends it in `Authorization: Bearer <token>` on subsequent requests.
4. A custom `OncePerRequestFilter` parses the token, verifies the signature, and sets the user's `UsernamePasswordAuthenticationToken` in `SecurityContextHolder.getContext()`.

---

---

### 28. How does Method-Level Security (`@PreAuthorize`) work?
**In Simple Words:**
`@PreAuthorize` uses Spring Expression Language (SpEL) to evaluate permissions before a method executes:
- `@PreAuthorize("hasRole('ADMIN')")`
- `@PreAuthorize("#userId == authentication.principal.id or hasRole('MANAGER')")`
Enabled via `@EnableMethodSecurity`.

---

---

### 29. What is CSRF and why is it disabled in stateless REST APIs?
**In Simple Words:**
CSRF (Cross-Site Request Forgery) tricks a browser into sending authenticated session cookies to a malicious site.
In stateless REST APIs using JWT stored in memory or request headers (not ambient browser cookies), CSRF attacks are fundamentally impossible, so `csrf.disable()` is safe and standard practice.

---

---

### 30. How does Password Hashing work with BCrypt in Spring Security?
**In Simple Words:**
Never store plaintext or plain MD5/SHA256 hashes:
`BCryptPasswordEncoder` uses a slow, adaptive hashing algorithm that automatically generates a random cryptographic salt and incorporates a configurable work factor (`cost` parameter, default 10 = 1024 iterations). It is resistant to rainbow table and brute-force GPU attacks.

---

---

### 31. What is the difference between Authentication and Authorization in Spring Security?
**In Simple Words:**
- **Authentication ("Who are you?")**: Verified via `AuthenticationManager` -> returns `Principal`.
- **Authorization ("What are you allowed to do?")**: Evaluated by `AccessDecisionManager` / `AuthorizationManager` -> checks `GrantedAuthority` roles.

---

---

### 32. How does OAuth 2.0 / OpenID Connect work with Spring Security?
**In Simple Words:**
Spring Security supports OAuth2 Resource Server and Client:
- Uses `oauth2ResourceServer(oauth2 -> oauth2.jwt())`.
- Automatically fetches and caches the Identity Provider's public keys from the JWKS URI (`.well-known/jwks.json`) to verify JWT tokens without making an HTTP call per request.

---

---

### 33. What is the Circuit Breaker Pattern, and how do you implement it with Resilience4j in Spring Boot?
**In Simple Words:**
Prevents cascading failures when a downstream service is down:
- **CLOSED**: Traffic flows normally.
- **OPEN**: Failure rate exceeds threshold (e.g. 50%); requests fail fast immediately without calling the broken service.
- **HALF-OPEN**: After a wait duration, test requests are sent to check if the downstream service recovered.

```java
@CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
public PaymentResponse chargeCard(PaymentRequest request) {
    return restTemplate.postForObject("/payments", request, PaymentResponse.class);
}

public PaymentResponse paymentFallback(PaymentRequest request, Throwable ex) {
    return new PaymentResponse("QUEUED_FOR_RETRY", "Payment service degraded");
}
```

---

---

### 34. How does Apache Kafka integrate with Spring Boot (`@KafkaListener`)?
**In Simple Words:**
Spring for Apache Kafka provides `KafkaTemplate` for publishing and `@KafkaListener` for consuming messages:
- Producers send structured JSON/Avro events to a topic partition.
- Consumers belong to a `ConsumerGroup`. Kafka automatically balances partitions among instances in the group.
- Dead Letter Topics (DLT) handle poisoned pills using `DefaultErrorHandler`.

```java
@Service
public class OrderEventConsumer {

    @KafkaListener(topics = "order-events", groupId = "inventory-group")
    public void handleOrderCreated(OrderEvent event) {
        log.info("Received order event for: {}", event.orderId());
        inventoryService.reserveStock(event.items());
    }
}
```

---

---

### 35. What is the Saga Pattern in Microservices (Choreography vs Orchestration)?
**In Simple Words:**
Manages distributed transactions across microservices without two-phase commit (2PC):
- **Choreography**: Each service publishes an event (e.g., `OrderCreated -> PaymentProcessed -> InventoryReserved`), and services react. Simple, but hard to track.
- **Orchestration**: A central Saga Orchestrator coordinates each step and triggers **Compensating Transactions** (e.g., refund payment, release stock) if any intermediate step fails.

---
