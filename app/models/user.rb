class User < ApplicationRecord
    attribute :password, :string
    validates :name, :password, length: { in: 6..20 }, presence: true
    validates :email, :username, presence: true, uniqueness: true

    has_many :trips
    has_many :trip_publics

		before_save :encrypt_password
    before_create :generate_token


  def self.authenticate(email, password)
    user = self.find_by_email(email)
    if user && user.password_hash == BCrypt::Engine.hash_secret(password, user.password_salt)
      user
    else
      nil
    end
  end

  def encrypt_password
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end

  # Generates a token for a user
  def generate_token
    token_gen = SecureRandom.hex
    self.token = token_gen
    token_gen
  end
end
