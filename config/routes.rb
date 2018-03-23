Rails.application.routes.draw do

  resources :hotels
  resources :trip_publics

  resources :users, expect: [:create]
  post '/register', to: 'users#create'

  resources :trips
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
