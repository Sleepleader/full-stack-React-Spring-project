# ==================== mall-gateway Dockerfile ====================
# 适配 Java 21

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY ../pom.xml ./pom.xml
COPY ../mall-common ./mall-common
COPY ../mall-gateway ./mall-gateway
RUN mvn clean package -pl mall-common,mall-gateway -am -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/mall-gateway/target/*.jar app.jar
EXPOSE 9527
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.cloud.nacos.discovery.server-addr=nacos:8848"]
