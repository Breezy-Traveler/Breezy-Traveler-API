Rails.application.routes.draw do

  resources :users, expect: [:create] do
    resources :trips do
      resources :hotels
      resources :sites
    end
  end

  post '/register', to: 'users#create'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
