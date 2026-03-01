# ==================== mall-user-service Dockerfile ====================
# 适配 Java 21

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.cloud.nacos.discovery.server-addr=nacos:8848", "--spring.datasource.url=jdbc:mysql://mysql:3306/smart_mall?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true"]
