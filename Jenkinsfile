pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    environment {
        SESSION_SECRET = credentials('SESSION_SECRET')
        JWT_SECRET = credentials('JWT_SECRET')
        GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')
        GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
        POSTGRES_PASSWORD = credentials('POSTGRES_PASSWORD')
    }

    stages {

        stage("Install Environment") {
            steps {
                echo 'Installing Environment'
                sh 'npm install'
            }
        }

        stage("Clean Docker Container") {
            steps {
                echo 'Cleaning Docker'
                sh 'docker stop $(docker ps -q)'
                sh 'docker rm $(docker ps -a -q)'
            }
        }

        stage("Build Test") {
            steps {
                echo 'Test npm run dev'
                sh 'npm run dev'
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
                    echo "GOOGLE_CALLBACK_URL=http://localhost:3333/api/auth/google/callback" >> .env
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
                sh 'docker build -t cozycare-backend-image'
                sh 'docker run -p 3333:3333 cozycare-backend-image'
            }
        }

    }
}