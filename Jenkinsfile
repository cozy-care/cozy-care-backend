pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {

        stage("Install Environment") {
            steps {
                echo 'Installing Environment'
                sh 'npm install'
            }
        }

        stage("Clear Running Docker Containers") {
            steps {
                script {
                    def containerIds = sh(script: 'docker ps -a --filter "ancestor=cozycare-backend-image" -q', returnStdout: true).trim()

                    if (containerIds) {
                        sh "docker stop ${containerIds}"
                        sh "docker rm ${containerIds}"
                    } else {
                        echo "No containers with the image 'cozycare-backend-image' found."
                    }
                }
            }
        }

        stage("Remove Old Docker Images") {
            steps {
                script {
                    def imageIds = sh(script: 'docker images --filter "reference=cozycare-backend-image" -q', returnStdout: true).trim()

                    if (imageIds) {
                        sh "docker rmi ${imageIds}"
                    } else {
                        echo "No images with the name 'cozycare-backend-image' found."
                    }
                }
            }
        }

        stage("Prepare Backend Environment"){
            steps {
                echo 'Create .env file'
                script {
                    sh 'touch .env'
                    sh '''
                    echo "CLIENT_URL=http://localhost:3000" >> .env
                    echo "API_PORT=3333" >> .env
                    echo "SESSION_SECRET=${SESSION_SECRET}" >> .env
                    echo "JWT_SECRET=${JWT_SECRET}" >> .env
                    echo "GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}" >> .env
                    echo "GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}" >> .env
                    echo "GOOGLE_CALLBACK_URL=https://gold39.ce.kmitl.ac.th/api/auth/google/callback" >> .env
                    echo "POSTGRES_HOST=161.246.70.39" >> .env
                    echo "POSTGRES_PORT=5432" >> .env
                    echo "POSTGRES_USER=cozycareadmin" >> .env
                    echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}" >> .env
                    echo "POSTGRES_DB=cozycaredb" >> .env
                    '''
                }
            }
        }

        stage("Docker Backend Up"){
            steps {
                echo 'Node/Express UP'
                sh 'docker build -t cozycare-backend-image .'
                sh 'docker run -d -p 3333:3333 cozycare-backend-image'
            }
        }
    }
}