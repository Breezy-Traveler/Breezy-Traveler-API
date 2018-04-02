Rails.application.routes.draw do

  resources :users, except: [:create] do
		collection do
	    resources :trips do
	      resources :hotels
	      resources :sites
	    end
		end
  end

  post '/register', to: 'register_login#register'
	post '/login', to: 'register_login#login'

  get '/quote_of_the_day', to: 'quote_of_the_day#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
