pipeline {
    agent any

    environment {
        GITHUB_TOKEN = credentials('github-token')
        KUBECONFIG   = credentials('kubeconfig')
        IMAGE_NAME   = 'ghcr.io/edem38/api-devops-demo'
        IMAGE_TAG    = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Récupération du code depuis GitHub..."
                checkout scm
            }
        }

        stage('Install') {
            steps {
                echo "Installation des dépendances..."
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                echo "Vérification du code..."
                sh 'npm run lint || true'
            }
        }

        stage('Tests') {
            steps {
                echo "Lancement des tests..."
                sh 'npm test'
            }
            post {
                always {
                    echo "Tests terminés — statut : ${currentBuild.result}"
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo "Construction de l'image Docker..."
                sh """
                    docker build \
                      -t ${IMAGE_NAME}:${IMAGE_TAG} \
                      -t ${IMAGE_NAME}:latest \
                      .
                """
            }
        }

        stage('Docker Push') {
            steps {
                echo "Push vers GitHub Container Registry..."
                sh """
                    echo \$GITHUB_TOKEN | \
                      docker login ghcr.io -u edem38 --password-stdin
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    docker push ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy K8s') {
            steps {
                echo "Déploiement sur Kubernetes..."
                sh """
                    kubectl --kubeconfig=\$KUBECONFIG apply -f k8s/
                    kubectl --kubeconfig=\$KUBECONFIG set image \
                      deployment/api-devops-demo \
                      api-devops-demo=${IMAGE_NAME}:${IMAGE_TAG}
                    kubectl --kubeconfig=\$KUBECONFIG rollout status \
                      deployment/api-devops-demo \
                      --timeout=120s
                """
            }
        }

        stage('Smoke Test') {
            steps {
                echo "Vérification du déploiement..."
                sh """
                    sleep 10
                    RESPONSE=\$(curl -sf http://localhost:30080/api/v1/health)
                    echo "Réponse : \$RESPONSE"
                    echo \$RESPONSE | grep -q '"status":"ok"'
                    echo "Smoke test OK !"
                """
            }
        }
    }

    post {
        success {
            echo "Pipeline réussi ! Version ${IMAGE_TAG} déployée."
        }
        failure {
            echo "Pipeline échoué ! Rollback en cours..."
            sh """
                kubectl --kubeconfig=\$KUBECONFIG rollout undo \
                  deployment/api-devops-demo || true
            """
        }
        always {
            sh 'docker logout ghcr.io || true'
            cleanWs()
        }
    }
}
